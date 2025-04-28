import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindCommentDto } from './dto/find-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user);
  }

  @Get()
  findAll(@Query() queryParams: FindCommentDto) {
    return this.commentsService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/restore')
  restore(@Param('id') id: string, @Request() req) {
    return this.commentsService.restore(id, req.user);
  }

  @Get(':id/replies')
  async findReplies(
    @Param('id') id: string,
    @Query('fullTree') fullTree: string,
  ) {
    // Check if fullTree parameter is true
    const loadFullTree = fullTree === 'true';

    if (loadFullTree) {
      // get the complete reply tree recursively
      return this.commentsService.loadCompleteReplyTree(id);
    } else {
      return this.commentsService.findCommentReplies(id);
    }
  }
}
