import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type IdentityDocument = Identity & Document;

@Schema()
export class Identity {
	@Prop({ default: uuidv4, unique: true })
	id: string;

	@Prop({
		required: true,
		unique: true,
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] 
	})
	email: string;

	@Prop({ required: true })
	hash: string;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
