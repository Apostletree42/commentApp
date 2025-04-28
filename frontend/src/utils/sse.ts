export class NotificationSSE {
    private eventSource: EventSource | null = null;
    private listeners: Array<(data: unknown) => void> = [];
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private readonly reconnectDelay = 5000;
    private isConnecting = false;

    constructor() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    connect(): void {
        if (this.isConnecting || this.eventSource) {
            return;
        }

        this.isConnecting = true;
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found, cannot connect to SSE');
            this.isConnecting = false;
            return;
        }
        const sseUrl = import.meta.env.VITE_SSE_URL || 'http://localhost:3000/sse';
        try {
            this.eventSource = new EventSource(
                `${sseUrl}/notifications?token=${token}`,
                { withCredentials: true }
            );

            this.eventSource.onopen = () => {
                console.log('SSE connection established');
                this.reconnectAttempts = 0;
                this.isConnecting = false;
            };

            this.eventSource.onmessage = (event) => {
                try {
                    console.log('SSE message received:', event.data);
                    const data = JSON.parse(event.data);
                    console.log('Parsed SSE data:', data);
                    this.notifyListeners(data);
                } catch (error) {
                    console.error('Error parsing SSE message:', error);
                }
            };

            this.eventSource.onerror = (error) => {
                console.error('SSE connection error:', error);
                this.handleConnectionError();
            };
        } catch (error) {
            console.error('Error creating EventSource:', error);
            this.isConnecting = false;
        }
    }

    private handleConnectionError(): void {
        this.disconnect();
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectTimer = setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`Attempting to reconnect SSE (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.connect();
            }, this.reconnectDelay);
        } else {
            console.error('Max SSE reconnection attempts reached');
            this.emit('maxReconnectAttemptsReached');
        }
    }

    private handleOnline(): void {
        console.log('Network connection restored');
        this.reconnectAttempts = 0;
        this.connect();
    }

    private handleOffline(): void {
        console.log('Network connection lost');
        this.disconnect();
    }

    disconnect(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        this.isConnecting = false;
    }

    addListener(callback: (data: unknown) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    private emit(eventName: string, data?: unknown): void {
        const customEvent = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(customEvent);
    }

    private notifyListeners(data: unknown): void {
        this.listeners.forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                console.error('Error in SSE listener:', error);
            }
        });
    }
}

export const notificationService = new NotificationSSE();