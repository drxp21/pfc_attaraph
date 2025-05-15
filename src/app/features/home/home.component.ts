import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ElectionInfoComponent } from './components/election-info/election-info.component';
import { EligibilityComponent } from './components/eligibility/eligibility.component';
import { CtaSectionComponent } from './components/cta-section/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent,
    HeroSectionComponent,
    ElectionInfoComponent,
    EligibilityComponent,
    CtaSectionComponent
  ],
  template: `
    <div class="home-page">
      <app-header></app-header>
      
      <main>
        <app-hero-section></app-hero-section>
        <app-election-info></app-election-info>
        <app-eligibility></app-eligibility>
        <app-cta-section></app-cta-section>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    main {
      flex: 1;
      padding-top: 0; /* Header is fixed position */
    }
  `]
})
export class HomeComponent {}