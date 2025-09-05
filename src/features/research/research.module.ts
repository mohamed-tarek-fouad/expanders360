import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { FileUploadService } from './file-upload.service';
import { ResearchDocumentSchemaFactory } from './schemas/research-document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ResearchDocument', schema: ResearchDocumentSchemaFactory }
    ])
  ],
  controllers: [ResearchController],
  providers: [ResearchService, FileUploadService],
  exports: [ResearchService]
})
export class ResearchModule {}
