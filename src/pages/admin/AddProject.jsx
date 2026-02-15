import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import FileSelectorWithUpload from '../../components/admin/FileSelectorWithUpload';
import DynamicArrayInput from '../../components/ui/DynamicArrayInput';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { addProject } from '../../services/projectService';
import SEO from '../../components/SEO';

const STEPS = [
  'Basic Info',
  'Hero Section',
  'Info Sections',
  'Gallery',
  'Review'
];

const CATEGORIES_OPTIONS = [
  'UX/UI Projects',
  'Logo',
  'Icons',
  'Web',
  'Mobile',
  'Branding'
];

const AddProject = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Basic Info
    id: '',
    title: '',
    subtitle: '',
    industry: '',
    client: '',
    description: '',
    top: false,
    categories: [],
    status: 'published',
    
    // Hero Section
    detailedPageInfo: { darkText: '', lightText: '' },
    figmaUrl: '',
    
    // Info Sections
    infoSections: [],
    
    // Gallery
    gallery: { images: [] }
  });

  const [filePaths, setFilePaths] = useState({
    thumbnail: '',
    heroImage: '',
    heroMockups: [],
    infoSections: [],
    gallery: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, value } = e.target;
    setFilePaths(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoriesChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleInfoSectionsChange = (sections) => {
    setFormData(prev => ({ ...prev, infoSections: sections }));
  };

  const handleInfoSectionFileChange = (index, field, path) => {
    setFilePaths(prev => {
      const newInfoSections = [...(prev.infoSections || [])];
      if (!newInfoSections[index]) {
        newInfoSections[index] = {};
      }
      newInfoSections[index][field] = path;
      return { ...prev, infoSections: newInfoSections };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Basic Info validation
      if (!formData.id.trim()) {
        newErrors.id = 'Project ID is required';
      } else if (!/^[a-z0-9-]+$/.test(formData.id)) {
        newErrors.id = 'ID must be lowercase letters, numbers, and hyphens only';
      }
      
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      } else if (formData.title.length < 3 || formData.title.length > 100) {
        newErrors.title = 'Title must be 3-100 characters';
      }
      
      if (!formData.subtitle.trim()) {
        newErrors.subtitle = 'Subtitle is required';
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
      
      if (formData.categories.length === 0) {
        newErrors.categories = 'Select at least one category';
      }
      
      if (!filePaths.thumbnail) {
        newErrors.thumbnail = 'Thumbnail image is required';
      }
    }

    if (step === 1) {
      // Hero Section validation
      if (!formData.detailedPageInfo.darkText.trim()) {
        newErrors['detailedPageInfo.darkText'] = 'Dark text is required';
      }
      
      if (!formData.detailedPageInfo.lightText.trim()) {
        newErrors['detailedPageInfo.lightText'] = 'Light text is required';
      }
      
      if (formData.figmaUrl && !formData.figmaUrl.match(/^https?:\/\/.+/)) {
        newErrors.figmaUrl = 'Figma URL must be a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!currentUser?.email) {
      showError('Authentication error. Please login again.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 AddProject: Submitting project...', { formData, filePaths });
      const result = await addProject(formData, filePaths, currentUser.email);
      console.log('✅ AddProject: Project saved with ID:', result.id);
      showSuccess('Project added successfully!');
      
      setTimeout(() => {
        console.log('🔄 AddProject: Navigating to /admin/projects');
        navigate('/admin/projects');
      }, 1500);
    } catch (error) {
      showError(error.message || 'Failed to add project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="heading-md mb-4">Basic Information</h2>
            
            <Input
              label="Project ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              error={errors.id}
              placeholder="my-awesome-project"
              required
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="My Awesome Project"
                required
              />
              
              <Input
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                error={errors.subtitle}
                placeholder="Web Application"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Technology"
              />
              
              <Input
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="A detailed description of the project..."
              rows={6}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Categories <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES_OPTIONS.map(category => (
                  <label
                    key={category}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.categories.includes(category)
                        ? 'border-primary bg-primary/5'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoriesChange(category)}
                      className="mr-2"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
              {errors.categories && (
                <p className="mt-2 text-sm text-red-500">{errors.categories}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="top"
                name="top"
                checked={formData.top}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="top" className="text-sm font-medium text-primary">
                Featured Project (show on homepage)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={formData.status === 'published'}
                onChange={(e) => handleChange({ 
                  target: { 
                    name: 'status', 
                    value: e.target.checked ? 'published' : 'draft' 
                  } 
                })}
                className="mr-2"
              />
              <label htmlFor="status" className="text-sm font-medium text-primary">
                Publish immediately
              </label>
            </div>
            
            <FileSelectorWithUpload
              label="Thumbnail"
              name="thumbnail"
              value={filePaths.thumbnail}
              onChange={handleFileChange}
              error={errors.thumbnail}
              required
              targetPath={`/images/projects/${formData.id || 'temp'}/thumbnail`}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="heading-md mb-4">Hero Section</h2>
            
            <div className="soft-card p-4 bg-blue-50">
              <p className="text-sm text-muted">
                The hero section appears at the top of the project detail page. You can either upload a single hero image OR multiple mockups.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Dark Text (Top Line)"
                name="detailedPageInfo.darkText"
                value={formData.detailedPageInfo.darkText}
                onChange={handleChange}
                error={errors['detailedPageInfo.darkText']}
                placeholder="Case Study"
                required
              />
              
              <Input
                label="Light Text (Bottom Line)"
                name="detailedPageInfo.lightText"
                value={formData.detailedPageInfo.lightText}
                onChange={handleChange}
                error={errors['detailedPageInfo.lightText']}
                placeholder="My Awesome Project"
                required
              />
            </div>
            
            <Input
              label="Figma Prototype URL"
              name="figmaUrl"
              value={formData.figmaUrl}
              onChange={handleChange}
              error={errors.figmaUrl}
              placeholder="https://www.figma.com/..."
            />
            
            <FileSelectorWithUpload
              label="Hero Image (Single)"
              name="heroImage"
              value={filePaths.heroImage}
              onChange={handleFileChange}
              targetPath={`/images/projects/${formData.id || 'temp'}/hero`}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted">OR</span>
              </div>
            </div>
            
            <FileSelectorWithUpload
              label="Hero Mockups (Multiple)"
              name="heroMockups"
              value={filePaths.heroMockups}
              onChange={handleFileChange}
              multiple
              targetPath={`/images/projects/${formData.id || 'temp'}/heroMockups`}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="heading-md mb-4">Info Sections</h2>
            
            <div className="soft-card p-4 bg-blue-50 mb-4">
              <p className="text-sm text-muted">
                Info sections appear in the middle of your project page. Add as many sections as needed to tell your project story.
              </p>
            </div>
            
            <DynamicArrayInput
              label="Sections"
              items={formData.infoSections}
              onChange={handleInfoSectionsChange}
              addButtonText="Add Info Section"
              emptyMessage="No info sections added yet"
              maxItems={20}
              renderItem={(section, index, onChange) => (
                <InfoSectionForm
                  section={section}
                  index={index}
                  onChange={onChange}
                  onFileChange={(field, path) => handleInfoSectionFileChange(index, field, path)}
                  filePaths={filePaths.infoSections?.[index] || {}}
                  projectId={formData.id || 'temp'}
                />
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="heading-md mb-4">Gallery</h2>
            
            <div className="soft-card p-4 bg-blue-50 mb-4">
              <p className="text-sm text-muted">
                The gallery appears at the bottom of your project page in a slider format.
              </p>
            </div>
            
            <FileSelectorWithUpload
              label="Gallery Images"
              name="gallery"
              value={filePaths.gallery}
              onChange={handleFileChange}
              multiple
              targetPath={`/images/projects/${formData.id || 'temp'}/gallery`}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="heading-md mb-4">Review & Submit</h2>
            
            <div className="soft-card">
              <h3 className="font-medium mb-2">Basic Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>ID:</strong> {formData.id}</p>
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Subtitle:</strong> {formData.subtitle}</p>
                <p><strong>Industry:</strong> {formData.industry || 'N/A'}</p>
                <p><strong>Client:</strong> {formData.client || 'N/A'}</p>
                <p><strong>Categories:</strong> {formData.categories.join(', ')}</p>
                <p><strong>Featured:</strong> {formData.top ? 'Yes' : 'No'}</p>
                <p><strong>Status:</strong> {formData.status}</p>
                <p><strong>Thumbnail:</strong> {filePaths.thumbnail ? '✓ Set' : 'None'}</p>
              </div>
            </div>
            
            <div className="soft-card">
              <h3 className="font-medium mb-2">Hero Section</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Hero Image:</strong> {filePaths.heroImage ? '✓ Set' : 'None'}</p>
                <p><strong>Hero Mockups:</strong> {filePaths.heroMockups?.length || 0} images</p>
                <p><strong>Figma URL:</strong> {formData.figmaUrl || 'None'}</p>
              </div>
            </div>
            
            <div className="soft-card">
              <h3 className="font-medium mb-2">Content</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Info Sections:</strong> {formData.infoSections.length}</p>
                <p><strong>Gallery Images:</strong> {filePaths.gallery?.length || 0}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <SEO title="Add Project" noindex />
      
      <div className="mb-8">
        <h1 className="heading-lg mb-2">Add New Project</h1>
        <p className="body-md text-muted">Create a new portfolio project</p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <span className={`ml-2 text-sm hidden md:block ${
                  index === currentStep ? 'text-primary font-medium' : 'text-muted'
                }`}>
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="soft-card max-w-4xl mb-8"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-4xl">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={18} className="mr-2" />
          Previous
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            type="button"
            variant="primary"
            onClick={nextStep}
          >
            Next
            <ChevronRight size={18} className="ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </Button>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AdminLayout>
  );
};

// Info Section Form Component
const InfoSectionForm = ({ section, index, onChange, onFileChange, filePaths, projectId }) => {
  const handleChange = (field, value) => {
    onChange({ ...section, [field]: value });
  };

  const handleTextSectionChange = (side, sections) => {
    onChange({ ...section, [side]: sections });
  };

  const handleFileSelect = (field, e) => {
    onFileChange(field, e.target.value);
  };

  return (
    <div className="soft-card p-4 space-y-4">
      <h4 className="font-medium">Section {index + 1}</h4>
      
      <Input
        label="Section Title"
        value={section.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Section title (optional)"
      />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`splitView-${index}`}
          checked={section.splitView || false}
          onChange={(e) => handleChange('splitView', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor={`splitView-${index}`} className="text-sm">
          Split View Layout (images on sides, text in middle)
        </label>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <FileSelectorWithUpload
          label="Top Image"
          name={`topImage-${index}`}
          value={filePaths?.topImage || ''}
          onChange={(e) => handleFileSelect('topImage', e)}
          targetPath={`/images/projects/${projectId}/infoSections`}
        />
        
        <FileSelectorWithUpload
          label="Bottom Image"
          name={`bottomImage-${index}`}
          value={filePaths?.bottomImage || ''}
          onChange={(e) => handleFileSelect('bottomImage', e)}
          targetPath={`/images/projects/${projectId}/infoSections`}
        />
      </div>
      
      <TextSectionInput
        label="Left Text Section"
        title={section.titleTextSectionLeft || ''}
        sections={section.textSectionLeft || []}
        onTitleChange={(value) => handleChange('titleTextSectionLeft', value)}
        onSectionsChange={(sections) => handleTextSectionChange('textSectionLeft', sections)}
      />
      
      <TextSectionInput
        label="Right Text Section"
        title={section.titleTextSectionRight || ''}
        sections={section.textSectionRight || []}
        onTitleChange={(value) => handleChange('titleTextSectionRight', value)}
        onSectionsChange={(sections) => handleTextSectionChange('textSectionRight', sections)}
      />
    </div>
  );
};

// Text Section Input Component
const TextSectionInput = ({ label, title, sections, onTitleChange, onSectionsChange }) => {
  return (
    <div className="border border-primary/10 rounded-lg p-4 space-y-3">
      <h5 className="text-sm font-medium">{label}</h5>
      
      <Input
        label="Section Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Section title (optional)"
      />
      
      <DynamicArrayInput
        label="Text Items"
        items={sections}
        onChange={onSectionsChange}
        addButtonText="Add Text Item"
        maxItems={10}
        showReorder={true}
        renderItem={(item, idx, onItemChange) => (
          <TextItemForm
            item={item}
            onChange={onItemChange}
          />
        )}
      />
    </div>
  );
};

// Text Item Form Component
const TextItemForm = ({ item, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const handleBulletPointsChange = (points) => {
    onChange({ ...item, bulletPoints: points });
  };

  return (
    <div className="space-y-3 border border-primary/10 rounded-lg p-3">
      <Textarea
        label="Top Text"
        value={item.topText || ''}
        onChange={(e) => handleChange('topText', e.target.value)}
        placeholder="Paragraph text..."
        rows={3}
      />
      
      <DynamicArrayInput
        label="Bullet Points"
        items={item.bulletPoints || []}
        onChange={handleBulletPointsChange}
        addButtonText="Add Bullet Point"
        maxItems={20}
        showReorder={false}
      />
      
      <Textarea
        label="Bottom Text"
        value={item.bottomText || ''}
        onChange={(e) => handleChange('bottomText', e.target.value)}
        placeholder="Paragraph text..."
        rows={3}
      />
    </div>
  );
};

export default AddProject;
