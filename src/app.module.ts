import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [DatabaseModule, SupabaseModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
