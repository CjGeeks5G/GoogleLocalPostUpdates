import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatCompletionRequest } from './dto/create-chat-completion-request.dto';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Chat Request")
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('chatcompletion')
  async createChatCompletion(@Body() body: CreateChatCompletionRequest) {
    return this.chatService.createChatCompletion(body.messages)
  }
}