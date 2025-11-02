import { Component, OnInit } from '@angular/core';
import { SlideService } from './sliderService/slide-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environment';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slider.html',
  styleUrls: ['./slider.css']
})
export class Slider implements OnInit {
  BACKEND_URL = environment.apiUrl;
  slides: any[] = [];
  formData: FormData = new FormData();
  previewUrl: string | ArrayBuffer | null = null;
  isEditMode = false;
  editId: number | null = null;

  constructor(private slideService: SlideService) {}

  ngOnInit() {
    this.loadSlides();
  }

  loadSlides() {
    this.slideService.getSlides().subscribe({
      next: (res: any[]) => {
        this.slides = res.map(slide => ({
          ...slide,
          imageUrl: slide.imageUrl?.startsWith('http')
            ? slide.imageUrl
            : `${this.BACKEND_URL}${slide.imageUrl}`
        }));
      },
      error: err => {
        console.error('❌ Failed to load slides', err);
        alert('Failed to load slides.');
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.set('ImageFile', file);
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  addOrUpdateSlide(title: string, subtitle: string, btnText: string, btnLink: string, order: any) {
    const numericOrder = Number(order);
    this.formData.set('Title', title);
    this.formData.set('Subtitle', subtitle);
    this.formData.set('ButtonText', btnText);
    this.formData.set('ButtonLink', btnLink);
    this.formData.set('Order', numericOrder.toString());

    const request = this.isEditMode && this.editId
      ? this.slideService.updateSlide(this.editId, this.formData)
      : this.slideService.addSlide(this.formData);

    request.subscribe(() => {
      this.resetForm();
      this.loadSlides();
      alert(this.isEditMode ? '✅ Slide Updated Successfully' : '✅ Slide Added Successfully');
    });
  }

  editSlide(slide: any) {
    this.isEditMode = true;
    this.editId = slide.id;
    this.previewUrl = slide.imageUrl;
    (document.getElementById('title') as HTMLInputElement).value = slide.title;
    (document.getElementById('subtitle') as HTMLInputElement).value = slide.subtitle;
    (document.getElementById('btnText') as HTMLInputElement).value = slide.buttonText;
    (document.getElementById('btnLink') as HTMLInputElement).value = slide.buttonLink;
    (document.getElementById('order') as HTMLInputElement).value = slide.order;
  }

  deleteSlide(id: number) {
    if (confirm('Are you sure to delete this slide?')) {
      this.slideService.deleteSlide(id).subscribe(() => {
        this.loadSlides();
      });
    }
  }

  resetForm() {
    this.formData = new FormData();
    this.previewUrl = null;
    this.isEditMode = false;
    this.editId = null;
    (document.getElementById('slideForm') as HTMLFormElement).reset();
  }
}
