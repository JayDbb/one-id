import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicantFactsModule } from './applicant-facts/applicant-facts.module';
import { FormModule } from './form/form.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PeopleModule } from './people/people.module';
import { ApplicationsModule } from './applications/applications.module';
import { FormsModule } from './forms/forms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EligibilityModule } from './eligibility/eligibility.module';
import { DocumentsModule } from './documents/documents.module';
import { FormRegistryModule } from './form-registry/form-registry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
    }),
    SupabaseModule,
    ApplicantFactsModule,
    PeopleModule,
    ApplicationsModule,
    FormsModule,
    DashboardModule,
    FormModule,
    EligibilityModule,
    DocumentsModule,
    FormRegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
