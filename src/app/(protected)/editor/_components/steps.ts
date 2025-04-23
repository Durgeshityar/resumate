import { DocumentEditorFormProps } from '@/lib/types'

import GeneralInforForm from './forms/general-info-form'
import PersonalInfoForm from './forms/personal-info-form'
import WorkExperienceForm from './forms/work-experience-form'
import EducationForm from './forms/education-form'
import SkillsForm from './forms/skills-form'
import SummaryForm from './forms/summary-from'
import ProjectForm from './forms/projects-form'
import CertificateForm from './forms/certificate-form'
import CourseworkForm from './forms/course-work'

export const steps: {
  title: string
  component: React.ComponentType<DocumentEditorFormProps>
  key: string
}[] = [
  { title: 'General info', component: GeneralInforForm, key: 'general-info' },
  { title: 'Personal info', component: PersonalInfoForm, key: 'personal-info' },
  {
    title: 'Work experience',
    component: WorkExperienceForm,
    key: 'work-experience',
  },
  {
    title: 'Projects',
    component: ProjectForm,
    key: 'projects',
  },
  {
    title: 'Certificates',
    component: CertificateForm,
    key: 'certificates',
  },

  {
    title: 'Coursework',
    component: CourseworkForm,
    key: 'course-work',
  },
  {
    title: 'Education',
    component: EducationForm,
    key: 'education',
  },
  {
    title: 'Skills',
    component: SkillsForm,
    key: 'skills',
  },
  {
    title: 'Summary',
    component: SummaryForm,
    key: 'summary',
  },
]
