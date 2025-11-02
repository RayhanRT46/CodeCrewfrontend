import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Page } from '../PagePostInterface';
import { PostPageService } from '../service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Title } from '@angular/platform-browser';



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
public tinymceConfig = {
    plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
      'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ],
    // NOTE: The function definition must be handled carefully in TypeScript.
    // For simplicity, you can often define this as a property or reference a method if needed.
    // However, the object structure itself is now valid in TypeScript.
    ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
    uploadcare_public_key: '88358b10322e5662393d',
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
    this.message = 'Form opened to create a new post.';
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
          this.message = '✅ Post successfully updated!';
          this.loadPages();
          this.closeForm(); // Hide form on success
        },
        error: (err) => this.message = `❌ Update failed: ${err.error?.message || 'API Error'}`
      });
    } else {
      // Create new page
      this.cmsService.createPage(pageData).subscribe({
        next: () => {
          this.message = '✅ New post successfully created!';
          this.loadPages();
          this.closeForm(); // Hide form on success
        },
        error: (err) => this.message = `❌ Creation failed: ${err.error?.message || 'API Error'}`
      });
    }
  }

  deletePage(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.cmsService.deletePage(id).subscribe({
        next: () => {
          this.message = `✅ Post deleted.`;
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
        console.error('Failed to load posts:', err);
        this.loading = false;
        this.message = '❌ Failed to load post. Check your token or API.';
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