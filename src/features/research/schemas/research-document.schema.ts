import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchDocument = ResearchDocumentSchema & Document;

@Schema({
  timestamps: true,
  collection: 'research_documents'
})
export class ResearchDocumentSchema {
  @Prop({ required: true, type: String })
  projectId: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop({ required: false })
  fileUrl?: string;

  // Timestamps will be automatically added by Mongoose
  createdAt?: Date;
  updatedAt?: Date;
}

export const ResearchDocumentSchemaFactory = SchemaFactory.createForClass(ResearchDocumentSchema);

// Create text indexes for search functionality
ResearchDocumentSchemaFactory.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// Create index on projectId for efficient queries
ResearchDocumentSchemaFactory.index({ projectId: 1 });

// Create index on uploadedAt for sorting
ResearchDocumentSchemaFactory.index({ uploadedAt: -1 });

// Create compound index for projectId and uploadedAt
ResearchDocumentSchemaFactory.index({ projectId: 1, uploadedAt: -1 });
