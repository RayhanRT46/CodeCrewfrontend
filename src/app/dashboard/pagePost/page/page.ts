import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Page } from '../PagePostInterface';
import { PostPageService } from '../service';
import { EditorModule } from '@tinymce/tinymce-angular';



@Component({
  selector: 'app-page-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,EditorModule],
  templateUrl: './page.html',
  styleUrl: './page.css'
})
export class Pages implements OnInit {
  
  pages: Page[] = [];
  pageForm!: FormGroup;
  isEditMode: boolean = false;
  loading: boolean = true;
  message: string = '';
  showForm: boolean = false;


  // 💡 TinyMCE Editor Configuration (Wordpress-like features)
  editorConfig = {
    base_url: '/tinymce', // You might need to adjust this depending on your setup
    suffix: '.min',
    height: 400,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | link image media | code | help'
  };

  constructor(
    private fb: FormBuilder,
    private cmsService: PostPageService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadPages();
  }

  // -------------------------
  // Form Initialization and Management
  // -------------------------
  initializeForm(): void {
    // Initialize Reactive Form group
    this.pageForm = this.fb.group({
      id: [0], 
      title: ['', Validators.required],
      slug: ['', Validators.required],
      content: ['', Validators.required],
      isPublished: [true],
    });
  }

  resetForm(): void {
    // Reset form fields to default/initial state
    this.pageForm.reset({
      id: 0,
      title: '',
      slug: '',
      content: '',
      isPublished: true 
    });
    this.isEditMode = false;
  }
  
  // 💡 Called when 'Create New Page' button is clicked
  openCreateForm(): void {
    this.resetForm();
    this.showForm = true; // Show the form
    this.message = 'Form opened to create a new page.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Called when 'Edit' button in the list is clicked
  editPage(page: Page): void {
    this.isEditMode = true;
    this.showForm = true; // Show the form
    this.pageForm.patchValue(page);
    this.message = `Editing Page ID ${page.id}.`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Called when 'Cancel' button is clicked or save is successful
  closeForm(): void {
    this.resetForm(); 
    this.showForm = false; // Hide the form
    this.message = 'Form closed.';
  }

  // -------------------------
  // CRUD Operations
  // -------------------------
  onSubmit(): void {
    if (this.pageForm.invalid) {
      this.message = 'Please fill out all required fields.';
      return;
    }

    const pageData: Page = this.pageForm.value;
    
    if (this.isEditMode) {
      // Update existing page
      this.cmsService.updatePage(pageData).subscribe({
        next: () => {
          this.message = '✅ Page successfully updated!';
          this.loadPages();
          this.closeForm(); // Hide form on success
        },
        error: (err) => this.message = `❌ Update failed: ${err.error?.message || 'API Error'}`
      });
    } else {
      // Create new page
      this.cmsService.createPage(pageData).subscribe({
        next: () => {
          this.message = '✅ New page successfully created!';
          this.loadPages();
          this.closeForm(); // Hide form on success
        },
        error: (err) => this.message = `❌ Creation failed: ${err.error?.message || 'API Error'}`
      });
    }
  }

  deletePage(id: number): void {
    if (confirm('Are you sure you want to delete this page?')) {
      this.cmsService.deletePage(id).subscribe({
        next: () => {
          this.message = `✅ Page ID ${id} deleted.`;
          this.loadPages();
          // Ensure form is hidden if the page being edited was deleted
          if (this.isEditMode && this.pageForm.get('id')?.value === id) {
              this.closeForm();
          }
        },
        error: (err) => this.message = `❌ Delete failed: ${err.error?.message || 'API Error'}`
      });
    }
  }

  // -------------------------
  // Read Operation
  // -------------------------
  loadPages(): void {
    this.loading = true;
    this.cmsService.getAllPages().subscribe({
      next: (data) => {
        this.pages = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load pages:', err);
        this.loading = false;
        this.message = '❌ Failed to load pages. Check your token or API.';
      }
    });
  }

  // -------------------------
  // Utility
  // -------------------------
  generateSlug(event: Event): void {
    const title = (event.target as HTMLInputElement).value;
    // Simple slug generation logic
    const slug = title.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.pageForm.get('slug')?.setValue(slug);
  }
}