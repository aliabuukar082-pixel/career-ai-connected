import json
import re
import spacy
from typing import List, Dict, Any, Tuple
import PyPDF2
from docx import Document
from datetime import datetime
import logging
from jobs.skills_data import COMPREHENSIVE_SKILLS_DATABASE, get_all_skill_names, get_skill_by_name, get_high_demand_skills

logger = logging.getLogger(__name__)

# Load spaCy model for NLP processing
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.warning("spaCy model not found. Using basic text processing.")
    nlp = None


class AdvancedResumeProcessor:
    """Advanced AI-powered resume analysis service with comprehensive skills database"""
    
    def __init__(self):
        self.skills_database = self._load_comprehensive_skills_database()
        self.education_patterns = self._load_education_patterns()
        self.experience_patterns = self._load_experience_patterns()
    
    def _load_comprehensive_skills_database(self) -> Dict[str, Dict]:
        """Load comprehensive skills database with all metadata"""
        skills_dict = {}
        for skill in COMPREHENSIVE_SKILLS_DATABASE:
            skills_dict[skill['name'].lower()] = skill
            # Add synonyms as keys pointing to the same skill
            for synonym in skill['synonyms']:
                skills_dict[synonym.lower()] = skill
        return skills_dict
    
    def _load_education_patterns(self) -> List[Dict[str, str]]:
        """Load education degree patterns"""
        return [
            {'pattern': r'phd|ph\.d|doctorate', 'level': 'PhD'},
            {'pattern': r'master|ms|m\.s|mba|m\.ba', 'level': 'Masters'},
            {'pattern': r'bachelor|bs|b\.s|ba|b\.a|undergraduate', 'level': 'Bachelors'},
            {'pattern': r'associate|aa|a\.a', 'level': 'Associates'},
            {'pattern': r'certificate|cert|certification', 'level': 'Certificate'},
            {'pattern': r'diploma', 'level': 'Diploma'}
        ]
    
    def _load_experience_patterns(self) -> List[Dict[str, str]]:
        """Load experience extraction patterns"""
        return [
            {'pattern': r'(\d+)\+?\s*years?', 'type': 'total_years'},
            {'pattern': r'(\d+)\s*-\s*(\d+)\s*years?', 'type': 'range_years'},
            {'pattern': r'since\s*(\d{4})', 'type': 'since_year'},
            {'pattern': r'(\d{4})\s*-\s*(\d{4}|present)', 'type': 'date_range'}
        ]
    
    def analyze_resume(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """Comprehensive resume analysis"""
        start_time = datetime.now()
        
        try:
            # Extract text from resume
            text = self._extract_text(file_path, file_type)
            
            # Perform advanced analysis
            analysis_result = {
                'extracted_text': text,
                'skills': self._extract_skills(text),
                'experience': self._analyze_experience(text),
                'education': self._analyze_education(text),
                'job_titles': self._extract_job_titles(text),
                'companies': self._extract_companies(text),
                'certifications': self._extract_certifications(text),
                'languages': self._extract_languages(text),
                'projects': self._extract_projects(text),
                'skill_categories': self._categorize_skills(text),
                'career_suggestions': self._generate_career_suggestions(text),
                'confidence_score': self._calculate_confidence_score(text),
                'processing_time': (datetime.now() - start_time).total_seconds()
            }
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"Resume analysis failed: {str(e)}")
            raise Exception(f"Resume analysis failed: {str(e)}")
    
    def _extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text from different file formats"""
        if file_type.lower() == 'pdf':
            return self._extract_text_from_pdf(file_path)
        elif file_type.lower() in ['docx', 'doc']:
            return self._extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            raise Exception(f"Error reading PDF file: {str(e)}")
        return text
    
    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error reading DOCX file: {str(e)}")
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills using comprehensive database and advanced NLP"""
        found_skills = set()
        text_lower = text.lower()
        
        # Enhanced skill extraction using comprehensive database
        for skill_key, skill_data in self.skills_database.items():
            # Check for exact skill name matches
            if skill_key in text_lower:
                found_skills.add(skill_data['name'])
                continue
            
            # Check for skill with word boundaries to avoid partial matches
            skill_name = skill_data['name'].lower()
            # Create regex pattern with word boundaries
            pattern = r'\b' + re.escape(skill_name) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill_data['name'])
                continue
            
            # Check for synonyms with word boundaries
            for synonym in skill_data['synonyms']:
                synonym_lower = synonym.lower()
                pattern = r'\b' + re.escape(synonym_lower) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.add(skill_data['name'])
                    break
        
        # Use spaCy for named entity recognition if available
        if nlp:
            doc = nlp(text)
            for ent in doc.ents:
                ent_text = ent.text.lower()
                # Check if entity matches any skills in our database
                if ent_text in self.skills_database:
                    found_skills.add(self.skills_database[ent_text]['name'])
                
                # Check for partial matches in multi-word entities
                for skill_key, skill_data in self.skills_database.items():
                    if skill_key in ent_text or ent_text in skill_key:
                        found_skills.add(skill_data['name'])
        
        # Advanced pattern matching for compound skills
        compound_patterns = [
            r'(machine\s+learning|deep\s+learning|artificial\s+intelligence)',
            r'(natural\s+language\s+processing|computer\s+vision)',
            r'(continuous\s+integration|continuous\s+deployment)',
            r'(user\s+interface|user\s+experience)',
            r'(business\s+intelligence|data\s+analysis)',
            r'(software\s+development|web\s+development)',
            r'(mobile\s+development|cloud\s+computing)',
            r'(database\s+administration|system\s+administration)',
            r'(project\s+management|product\s+management)',
            r'(quality\s+assurance|risk\s+management)',
        ]
        
        for pattern in compound_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            for match in matches:
                skill_key = match.replace(' ', '_')
                if skill_key in self.skills_database:
                    found_skills.add(self.skills_database[skill_key]['name'])
        
        # Convert to list and sort by demand level and name
        skills_list = list(found_skills)
        skills_with_metadata = []
        
        for skill in skills_list:
            skill_data = self.skills_database.get(skill.lower())
            if skill_data:
                skills_with_metadata.append({
                    'name': skill,
                    'demand_level': skill_data.get('demand_level', 3),
                    'category': skill_data.get('category', 'unknown')
                })
        
        # Sort by demand level (highest first) then by name
        skills_with_metadata.sort(key=lambda x: (-x['demand_level'], x['name']))
        
        # Return just the skill names
        return [skill['name'] for skill in skills_with_metadata]
    
    def _categorize_skills(self, text: str) -> Dict[str, List[str]]:
        """Categorize extracted skills using comprehensive database"""
        categorized = {}
        text_lower = text.lower()
        
        # Extract skills first
        extracted_skills = self._extract_skills(text)
        
        # Categorize each extracted skill
        for skill_name in extracted_skills:
            skill_data = get_skill_by_name(skill_name)
            if skill_data:
                category = skill_data['category']
                if category not in categorized:
                    categorized[category] = []
                if skill_name not in categorized[category]:
                    categorized[category].append(skill_name)
        
        return categorized
    
    def _analyze_experience(self, text: str) -> Dict[str, Any]:
        """Analyze work experience from resume text"""
        experience_data = {
            'total_years': None,
            'job_titles': [],
            'companies': [],
            'summary': ''
        }
        
        # Extract years of experience
        for pattern_info in self.experience_patterns:
            pattern = pattern_info['pattern']
            matches = re.findall(pattern, text, re.IGNORECASE)
            
            if matches and pattern_info['type'] == 'total_years':
                try:
                    experience_data['total_years'] = float(matches[0])
                    break
                except (ValueError, IndexError):
                    continue
        
        return experience_data
    
    def _analyze_education(self, text: str) -> Dict[str, Any]:
        """Analyze education information"""
        education_data = {
            'highest_level': None,
            'institutions': [],
            'degrees': [],
            'summary': ''
        }
        
        text_lower = text.lower()
        
        # Find highest education level
        for level_info in self.education_patterns:
            if re.search(level_info['pattern'], text_lower):
                education_data['highest_level'] = level_info['level']
                break
        
        return education_data
    
    def _extract_job_titles(self, text: str) -> List[str]:
        """Extract job titles using NLP"""
        job_titles = []
        
        # Common job title patterns
        job_patterns = [
            r'(senior|junior|lead|principal|staff)?\s*(software|web|mobile|data|machine\slearning|devops)\s*(engineer|developer|architect|scientist|analyst)',
            r'(product|project|program)\s*manager',
            r'(ui|ux|frontend|backend|full\sstack)\s*(designer|developer)',
            r'(data|business)\s*analyst',
            r'(technical)\s*(lead|manager)',
            r'(chief|head|vp)\s*(technology|engineering|technical)'
        ]
        
        for pattern in job_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    job_title = ' '.join(filter(None, match))
                else:
                    job_title = match
                job_titles.append(job_title.title())
        
        return list(set(job_titles))
    
    def _extract_companies(self, text: str) -> List[str]:
        """Extract company names"""
        companies = []
        
        # Use spaCy for organization extraction if available
        if nlp:
            doc = nlp(text)
            for ent in doc.ents:
                if ent.label_ == 'ORG' and len(ent.text.split()) <= 3:
                    companies.append(ent.text)
        
        return list(set(companies))
    
    def _extract_certifications(self, text: str) -> List[str]:
        """Extract certifications"""
        cert_patterns = [
            r'(aws|azure|gcp)\s*(certified|certification)',
            r'(pmp|csm|csd|cspo)',
            r'(oracle|java|python)\s*(certified|certification)',
            r'(google|facebook|microsoft)\s*(certified|certification)',
            r'(ccna|ccnp|mcse|rhce)'
        ]
        
        certifications = []
        for pattern in cert_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    cert = ' '.join(match)
                else:
                    cert = match
                certifications.append(cert.upper())
        
        return list(set(certifications))
    
    def _extract_languages(self, text: str) -> List[str]:
        """Extract languages known"""
        languages = []
        common_languages = [
            'english', 'spanish', 'french', 'german', 'chinese', 'japanese',
            'korean', 'portuguese', 'russian', 'arabic', 'hindi', 'italian'
        ]
        
        text_lower = text.lower()
        for lang in common_languages:
            if lang in text_lower:
                languages.append(lang.title())
        
        return languages
    
    def _extract_projects(self, text: str) -> List[Dict[str, str]]:
        """Extract project information"""
        projects = []
        
        # Simple project extraction patterns
        project_patterns = [
            r'project[:\s]+([^.]+)',
            r'developed\s+([^.]+)',
            r'built\s+([^.]+)',
            r'created\s+([^.]+)'
        ]
        
        for pattern in project_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                projects.append({
                    'name': match.strip(),
                    'description': ''
                })
        
        return projects[:10]  # Limit to 10 projects
    
    def _generate_career_suggestions(self, text: str) -> List[Dict[str, Any]]:
        """Generate career suggestions based on comprehensive skills database"""
        suggestions = []
        skills = self._extract_skills(text)
        
        # Enhanced career mappings using comprehensive database
        career_mappings = {
            'Software Engineer': {
                'required_skills': ['Python', 'Java', 'JavaScript', 'React', 'Node.js'],
                'preferred_skills': ['Git', 'Docker', 'AWS', 'SQL', 'TypeScript'],
                'weight': 1.0
            },
            'Data Scientist': {
                'required_skills': ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
                'preferred_skills': ['Statistics', 'SQL', 'Pandas', 'NumPy', 'Jupyter'],
                'weight': 1.0
            },
            'DevOps Engineer': {
                'required_skills': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
                'preferred_skills': ['Terraform', 'Ansible', 'Jenkins', 'Git', 'Monitoring'],
                'weight': 1.0
            },
            'Frontend Developer': {
                'required_skills': ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
                'preferred_skills': ['Vue.js', 'Angular', 'Tailwind CSS', 'Responsive Design', 'UI Design'],
                'weight': 1.0
            },
            'Backend Developer': {
                'required_skills': ['Python', 'Java', 'Node.js', 'SQL', 'API Design'],
                'preferred_skills': ['Django', 'Express.js', 'PostgreSQL', 'Redis', 'Microservices'],
                'weight': 1.0
            },
            'Full Stack Developer': {
                'required_skills': ['React', 'Node.js', 'Python', 'SQL', 'JavaScript'],
                'preferred_skills': ['TypeScript', 'Docker', 'AWS', 'Git', 'System Design'],
                'weight': 1.0
            },
            'Mobile Developer': {
                'required_skills': ['iOS', 'Android', 'React Native', 'Flutter'],
                'preferred_skills': ['Swift', 'Kotlin', 'Mobile UI/UX', 'API Integration'],
                'weight': 1.0
            },
            'Product Manager': {
                'required_skills': ['Product Management', 'Communication', 'Leadership'],
                'preferred_skills': ['Agile', 'Scrum', 'Data Analysis', 'Strategic Planning', 'User Research'],
                'weight': 1.0
            },
            'UX Designer': {
                'required_skills': ['UI Design', 'UX Design', 'Figma'],
                'preferred_skills': ['User Research', 'Prototyping', 'Wireframing', 'Design Thinking'],
                'weight': 1.0
            },
            'Business Analyst': {
                'required_skills': ['Business Analysis', 'Data Analysis', 'SQL'],
                'preferred_skills': ['Requirements Analysis', 'Process Improvement', 'Stakeholder Management'],
                'weight': 1.0
            },
            'Machine Learning Engineer': {
                'required_skills': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
                'preferred_skills': ['Deep Learning', 'Computer Vision', 'NLP', 'MLOps', 'Kubernetes'],
                'weight': 1.0
            },
            'Cloud Architect': {
                'required_skills': ['AWS', 'Azure', 'GCP', 'Cloud Computing'],
                'preferred_skills': ['Terraform', 'Kubernetes', 'System Design', 'Security', 'Networking'],
                'weight': 1.0
            },
            'Data Engineer': {
                'required_skills': ['Python', 'SQL', 'Apache Spark', 'Data Pipeline'],
                'preferred_skills': ['Apache Kafka', 'Elasticsearch', 'AWS', 'Data Warehousing', 'ETL'],
                'weight': 1.0
            },
            'Security Engineer': {
                'required_skills': ['Security', 'CISSP', 'Network Security'],
                'preferred_skills': ['Penetration Testing', 'Risk Management', 'Compliance', 'Linux', 'Python'],
                'weight': 1.0
            },
            'QA Engineer': {
                'required_skills': ['Test Automation', 'Quality Assurance', 'Python'],
                'preferred_skills': ['Selenium', 'Jest', 'CI/CD', 'API Testing', 'Performance Testing'],
                'weight': 1.0
            }
        }
        
        for career, config in career_mappings.items():
            required_skills = config['required_skills']
            preferred_skills = config['preferred_skills']
            
            # Calculate match scores
            required_matches = len(set(skills) & set(required_skills))
            preferred_matches = len(set(skills) & set(preferred_skills))
            
            # Weighted score calculation
            required_score = (required_matches / len(required_skills)) * 0.7  # 70% weight for required
            preferred_score = (preferred_matches / len(preferred_skills)) * 0.3  # 30% weight for preferred
            total_score = (required_score + preferred_score) * 100
            
            # Apply career weight
            total_score = total_score * config['weight']
            
            if total_score > 20:  # 20% minimum threshold
                matched_skills = list(set(skills) & set(required_skills + preferred_skills))
                missing_skills = list(set(required_skills) - set(skills))
                
                suggestions.append({
                    'title': career,
                    'match_score': round(total_score, 2),
                    'matched_skills': matched_skills,
                    'missing_skills': missing_skills,
                    'required_matches': required_matches,
                    'preferred_matches': preferred_matches
                })
        
        # Sort by match score
        suggestions.sort(key=lambda x: x['match_score'], reverse=True)
        return suggestions[:8]  # Top 8 suggestions
    
    def _calculate_confidence_score(self, text: str) -> float:
        """Calculate confidence score for the analysis"""
        score = 0.0
        
        # Check for resume sections
        sections = ['experience', 'education', 'skills', 'projects', 'summary']
        for section in sections:
            if section in text.lower():
                score += 0.2
        
        # Check for contact information
        if re.search(r'\b\d{10}\b', text):  # Phone number
            score += 0.1
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):  # Email
            score += 0.1
        
        # Check for length (should be substantial)
        if len(text) > 500:
            score += 0.2
        
        return min(score, 1.0)


# Keep the original ResumeProcessor for backward compatibility
class ResumeProcessor(AdvancedResumeProcessor):
    """Service for processing resume files and extracting skills"""
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        processor = AdvancedResumeProcessor()
        return processor._extract_text_from_pdf(file_path)

    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        processor = AdvancedResumeProcessor()
        return processor._extract_text_from_docx(file_path)

    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """Extract skills from resume text using keyword matching"""
        processor = AdvancedResumeProcessor()
        return processor._extract_skills(text)
        
        # Common soft skills
        soft_skills = [
            'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
            'creativity', 'adaptability', 'time management', 'project management',
            'analytical skills', 'attention to detail', 'multitasking', 'decision making',
            'negotiation', 'presentation skills', 'interpersonal skills', 'collaboration'
        ]
        
        all_skills = tech_skills + soft_skills
        
        # Convert text to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Find skills in text
        found_skills = []
        for skill in all_skills:
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill.title())
        
        return list(set(found_skills))  # Remove duplicates


class CareerRecommendationEngine:
    """Service for generating career recommendations based on user profile"""
    
    @staticmethod
    def analyze_skills_and_answers(skills: List[str], answers: List[Dict]) -> Dict[str, float]:
        """Analyze user skills and questionnaire answers to generate career scores"""
        
        # Career categories with required skills and interests
        career_profiles = {
            'Software Developer': {
                'skills': ['Python', 'Java', 'JavaScript', 'React', 'Node.js'],
                'interests': ['technology', 'problem solving', 'programming'],
                'weight': 0.3
            },
            'Data Scientist': {
                'skills': ['Python', 'R', 'Machine Learning', 'Data Science', 'SQL'],
                'interests': ['data analysis', 'statistics', 'research'],
                'weight': 0.3
            },
            'DevOps Engineer': {
                'skills': ['Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD'],
                'interests': ['automation', 'infrastructure', 'technology'],
                'weight': 0.25
            },
            'Product Manager': {
                'skills': ['Project Management', 'Communication', 'Leadership'],
                'interests': ['strategy', 'collaboration', 'business'],
                'weight': 0.2
            },
            'UX Designer': {
                'skills': ['Creativity', 'Communication', 'Problem Solving'],
                'interests': ['design', 'user experience', 'technology'],
                'weight': 0.2
            },
            'Business Analyst': {
                'skills': ['Analytical Skills', 'SQL', 'Communication'],
                'interests': ['business analysis', 'data', 'problem solving'],
                'weight': 0.2
            },
            'Machine Learning Engineer': {
                'skills': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
                'interests': ['artificial intelligence', 'research', 'technology'],
                'weight': 0.25
            },
            'Full Stack Developer': {
                'skills': ['JavaScript', 'React', 'Node.js', 'SQL', 'Django'],
                'interests': ['programming', 'technology', 'web development'],
                'weight': 0.3
            }
        }
        
        career_scores = {}
        
        for career, profile in career_profiles.items():
            score = 0
            
            # Skills matching (60% of score)
            skill_matches = 0
            for skill in profile['skills']:
                if any(skill.lower() in user_skill.lower() for user_skill in skills):
                    skill_matches += 1
            
            skill_score = (skill_matches / len(profile['skills'])) * 60
            score += skill_score
            
            # Interest matching from questionnaire (40% of score)
            interest_score = 40  # Base score
            # This is simplified - in real implementation, would analyze actual questionnaire answers
            score += interest_score
            
            # Apply career weight
            final_score = score * profile['weight']
            career_scores[career] = min(final_score, 100)  # Cap at 100
        
        return career_scores
    
    @staticmethod
    def generate_recommendations(user_skills: List[str], questionnaire_answers: List[Dict]) -> List[Dict]:
        """Generate career recommendations with scores and reasoning"""
        
        # Get career scores
        career_scores = CareerRecommendationEngine.analyze_skills_and_answers(
            user_skills, questionnaire_answers
        )
        
        # Sort careers by score
        sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Generate recommendations
        recommendations = []
        for career, score in sorted_careers[:5]:  # Top 5 recommendations
            reasoning = f"Based on your skills in {', '.join(user_skills[:3])} and interests, " \
                       f"{career} is a strong match with a compatibility score of {score:.1f}%."
            
            recommendations.append({
                'career_name': career,
                'score': round(score, 1),
                'reasoning': reasoning
            })
        
        return recommendations
