import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicantFactsModule } from './applicant-facts/applicant-facts.module';
import { FormModule } from './form/form.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    ApplicantFactsModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
