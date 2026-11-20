(function(){
'use strict';
const PASS_XP=500;
const COURSE_PACE={minWeeks:4,targetWeeks:5,maxWeeks:6};
const SHARED=['xp','crystals','chests'];
const COURSE_CATALOG={
  D755:{
    id:'D755',
    title:'Assessment for Special Education',
    version:'majick-course-1',
    concepts:[{id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'}],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['uploaded-notes']},
    studySections:[],sources:[],localGenerated:true,catalogSeed:true
  },
  D772:{
    id:'D772',
    title:'Statistical Data Literacy',
    version:'majick-course-1',
    concepts:[{id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'}],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['uploaded-notes']},
    studySections:[],sources:[],localGenerated:true,catalogSeed:true
  },
  D669:{
    id:'D669',
    title:'Early Literacy Methods',
    version:'majick-d669-2026-11',
    concepts:[
      {id:'d669-s1-standards',title:'Standards and Resources in Literacy',section:'Section 1',priority:'core'},
      {id:'d669-s2-reading',title:'Foundations of Reading',section:'Section 2',priority:'core'},
      {id:'d669-s3-communication',title:'Elements of Literacy',section:'Section 3',priority:'core'},
      {id:'d669-s4-genres',title:'Features of Text Across Genres',section:'Section 4',priority:'core'},
      {id:'d669-s5-writing',title:'Concepts and Structures in Writing',section:'Section 5',priority:'core'}
    ],
    glossary:{
      literacy:'The ability to read, write, understand and use information to communicate and participate in society.',
      'reading brain':'A network of brain regions working together to connect written words, spoken language and meaning.',
      'systematic instruction':'Teaching skills in a planned sequence, building from easier concepts to more complex ones.',
      'explicit instruction':'Direct explanation and modeling followed by guided practice, feedback and independent application.',
      MTSS:'Multi-tiered systems of support: a framework of increasingly targeted academic and behavioral supports guided by student data.',
      phonology:'The sound patterns and relationships of speech sounds in a language.',
      'sound-symbol':'The connection between letters or letter combinations and the sounds they represent.',
      syllable:'A spoken word part organized around a vowel sound.',
      morphology:'The structure of words and meaningful parts such as roots, prefixes and suffixes.',
      syntax:'How words are arranged into phrases, clauses and sentences.',
      semantics:'The meaning of words and phrases and their relationships.',
      'systematic and cumulative':'Instruction in a deliberate order, with each new skill building on prior learning.',
      diagnostic:'Instruction informed by ongoing assessment of a learner’s strengths and needs.',
      'content standard':'The knowledge, skill or concept students are expected to learn at a grade level.',
      'performance standard':'The level or form of proficiency students must demonstrate for a content standard.',
      'unpacking a standard':'Identifying its content, required skill and expected performance to plan instruction and assessment.',
      'Bloom’s Taxonomy':'A framework for thinking about the level of cognitive work a learning task requires.',
      multisensory:'Instruction that deliberately combines senses and movement, such as seeing, hearing, touching and acting, to reinforce a learning goal.',
      'literacy-rich environment':'A classroom with meaningful opportunities and materials for reading, writing, speaking and listening across the curriculum.',
      auditory:'Hearing and speaking sounds or words during a learning task.',
      visual:'Seeing print, pictures, letters or a displayed model during a learning task.',
      'kinesthetic/tactile':'Moving or touching materials as part of a learning task.',
      'word mapping':'Connecting the sounds in a spoken word to the letters that represent them, using deliberate hearing, seeing and sound-counting actions.'
    },
    questionBank:[
      {id:'d669-s1-l1-dyslexia-myth',topicId:'d669-s1-standards',section:'Section 1',prompt:'True or false: Dyslexia is a visual problem in which people see letters and words backward.',options:['True','False'],answer:'False',why:'Dyslexia is not explained by seeing letters backward. Reading instruction should teach sound–letter connections explicitly and systematically.',source:'User-provided D669 Lesson 1.1 guided practice'},
      {id:'d669-s1-l1-discovery',topicId:'d669-s1-standards',section:'Section 1',prompt:'True or false: Discovery learning alone is the most effective way to teach beginning reading.',options:['True','False'],answer:'False',why:'Foundational skills benefit from systematic, explicit instruction with modeling, guided practice and feedback.',source:'User-provided D669 Lesson 1.1 guided practice'},
      {id:'d669-s1-l2-sequence',topicId:'d669-s1-standards',section:'Section 1',prompt:'A teacher models a sound–letter pattern, practices it with the class, checks responses, and revisits it before introducing a harder pattern. Which teaching principle is illustrated?',options:['Systematic and cumulative','Discovery learning alone','Unplanned exposure','Reading level labels'],answer:'Systematic and cumulative',why:'The instruction follows a planned sequence and builds on earlier learning. Modeling and guided practice are also explicit teaching moves.',source:'Original Majick practice based on user-provided D669 Lesson 1.2'},
      {id:'d669-s1-l2-diagnostic',topicId:'d669-s1-standards',section:'Section 1',prompt:'After a quick check, a teacher finds a student can blend sounds but struggles with vowel spellings. What is the most diagnostic next step?',options:['Teach and monitor the vowel pattern the student needs','Repeat every phonics skill for the whole class','Wait until the next annual test','Assign a harder book without support'],answer:'Teach and monitor the vowel pattern the student needs',why:'Diagnostic instruction uses current evidence to target a specific need and checks the response.',source:'Original Majick practice based on user-provided D669 Lesson 1.2'},
      {id:'d669-s1-l2-materials',topicId:'d669-s1-standards',section:'Section 1',prompt:'A district spelling resource is evidence-aligned and accessible to students, while a fun free resource is not accessible. Which planning consideration most directly guides the choice?',options:['Selection of materials','Ignoring accessibility','Using one task for every student','Avoiding progress checks'],answer:'Selection of materials',why:'Choose materials for evidence alignment, accessibility, and fit for learners; differentiation is also relevant to access.',source:'Original Majick practice based on user-provided D669 Lesson 1.2'},
      {id:'d669-s1-l2-mtss',topicId:'d669-s1-standards',section:'Section 1',prompt:'Several students continue to struggle after core reading instruction. The teacher checks which foundational skill is missing and plans added targeted support. Which framework organizes tiers of support?',options:['Multi-tiered systems of support (MTSS)','A fixed reading label','A one-time book choice','A spelling game alone'],answer:'Multi-tiered systems of support (MTSS)',why:'MTSS uses evidence to provide increasingly targeted instruction and monitor how students respond.',source:'Original Majick practice based on user-provided D669 Lesson 1.2'},
      {id:'d669-s1-l3-unpack',topicId:'d669-s1-standards',section:'Section 1',prompt:'A literacy standard says, “Blend words with four or five phonemes when reading.” What is the required skill?',options:['Blend','Words','Four or five phonemes','Reading'],answer:'Blend',why:'The verb identifies the action students must perform. The noun phrase identifies the content, and the full statement clarifies the expected performance.',source:'Original Majick practice based on user-provided D669 Lesson 1.3'},
      {id:'d669-s1-l3-content-performance',topicId:'d669-s1-standards',section:'Section 1',prompt:'A teacher identifies the literacy skill a grade expects, then specifies how well students must demonstrate it. Which distinction is being made?',options:['Content standard and performance standard','Phonology and semantics','Core instruction and recess','Materials and classroom decoration'],answer:'Content standard and performance standard',why:'The content standard describes what to learn; the performance standard describes the level or evidence of proficiency.',source:'Original Majick practice based on user-provided D669 Lesson 1.3'},
      {id:'d669-s1-l4-alignment',topicId:'d669-s1-standards',section:'Section 1',prompt:'A standard asks students to explain how a text is organized. Which activity provides the strongest evidence of that skill?',options:['Explain the text’s sections and how they connect','Complete an unrelated word search','Copy the cover illustration','Listen without discussing the organization'],answer:'Explain the text’s sections and how they connect',why:'The activity asks students to demonstrate the same thinking named in the standard and produces observable evidence.',source:'Original Majick practice based on user-provided D669 Lesson 1.4'},
      {id:'d669-s1-l4-progress',topicId:'d669-s1-standards',section:'Section 1',prompt:'A unit builds from identifying details to explaining a main idea with evidence. What should a teacher plan alongside that sequence?',options:['Checks of progress and adjustments to instruction','Only an end-of-year grade','A new unrelated text every day','One task regardless of student responses'],answer:'Checks of progress and adjustments to instruction',why:'Instructional coherence includes learning targets, evidence of progress and changes when students need additional support.',source:'Original Majick practice based on user-provided D669 Lesson 1.4'},
      {id:'d669-s1-l1-quiz-1',topicId:'d669-s1-standards',section:'Section 1',prompt:'Why is it important for elementary schools to recognize and address assumptions about literacy?',options:['Because literacy is not important for children','Because schools only teach math and science','To ensure all students receive an equitable education and have the opportunity to succeed'],answer:'To ensure all students receive an equitable education and have the opportunity to succeed',why:'Checking assumptions helps teachers choose instruction that gives every student access to literacy learning.',source:'User-provided WGU D669 Lesson 1 quiz, Question 1'},
      {id:'d669-s1-l1-quiz-2',topicId:'d669-s1-standards',section:'Section 1',prompt:'Why do teachers use standards when planning lessons?',options:['To make sure students learn skills and content needed.','To make lessons more fun.','To follow the school’s rules.'],answer:'To make sure students learn skills and content needed.',why:'Standards specify the skills and content to teach and help align lessons and assessment.',source:'User-provided WGU D669 Lesson 1 quiz, Question 2'},
      {id:'d669-s1-l1-quiz-3',topicId:'d669-s1-standards',section:'Section 1',prompt:'Which of the following best describes the approach used in structured literacy?',options:['Relies primarily on students’ natural exposure to language and reading.','Encourages students to discover reading strategies on their own through exploration and play.','Focuses on explicit, systematic instruction in phonemic awareness, phonics, and other foundational skills.','Emphasizes the use of context and whole texts to teach reading.'],answer:'Focuses on explicit, systematic instruction in phonemic awareness, phonics, and other foundational skills.',why:'Structured literacy teaches the underlying language and print skills through an explicit, systematic sequence.',source:'User-provided WGU D669 Lesson 1 quiz, Question 3'},
      {id:'d669-s1-l2-intro-1',topicId:'d669-s1-standards',section:'Section 1',prompt:'What is one of the goals of a literacy-rich environment?',options:['Encouraging competition among students in reading and writing','Providing digital literacy experiences only','Limiting reading activities to the language arts curriculum','Fostering the connection of letter-sound and letter-word within meaning contexts'],answer:'Fostering the connection of letter-sound and letter-word within meaning contexts',why:'A literacy-rich environment helps students connect print, sounds and meaning while reading and writing across contexts.',source:'User-provided WGU D669 Lesson 2 introduction guided practice'},
      {id:'d669-s1-l2-intro-2',topicId:'d669-s1-standards',section:'Section 1',prompt:'Which of the following is NOT a component of a literacy-rich classroom environment?',options:['Labeling things and places throughout the classroom','Displays like anchor charts and word walls','Classroom libraries with fiction and nonfiction texts','Regular field trips to local libraries'],answer:'Regular field trips to local libraries',why:'A field trip can be valuable, but it is not a component of the classroom environment itself.',source:'User-provided WGU D669 Lesson 2 introduction guided practice'},
      {id:'d669-s1-l2-rich-relevance',topicId:'d669-s1-standards',section:'Section 1',prompt:'A teacher chooses texts that match the literacy standard and connect to students’ experiences. Which RICH step is this?',options:['Relevance','Inclusive','Creative','Hands-on'],answer:'Relevance',why:'Relevance asks whether materials connect to both instructional standards and students.',source:'Original Majick practice based on user-provided D669 Lesson 2.1'},
      {id:'d669-s1-l2-rich-inclusive',topicId:'d669-s1-standards',section:'Section 1',prompt:'A classroom library reflects the learners in the room and offers perspectives beyond their own. Which RICH step is this?',options:['Relevance','Inclusive','Creative','Hands-on'],answer:'Inclusive',why:'Inclusive materials represent learners and help them encounter new perspectives.',source:'Original Majick practice based on user-provided D669 Lesson 2.1'},
      {id:'d669-s1-l2-rich-creative',topicId:'d669-s1-standards',section:'Section 1',prompt:'A writing-center task invites students to invent and explain different solutions to a story problem. Which RICH step is this?',options:['Relevance','Inclusive','Creative','Hands-on'],answer:'Creative',why:'Creative materials spark new ideas, critical thinking and problem solving.',source:'Original Majick practice based on user-provided D669 Lesson 2.1'},
      {id:'d669-s1-l2-rich-hands-on',topicId:'d669-s1-standards',section:'Section 1',prompt:'Students use letter tiles while saying and writing the sounds they hear. Which RICH step is this?',options:['Relevance','Inclusive','Creative','Hands-on'],answer:'Hands-on',why:'The task provides multiple ways to interact with a clearly taught sound–symbol skill.',source:'Original Majick practice based on user-provided D669 Lesson 2.1'},
      {id:'d669-s1-l2-multi-trace',topicId:'d669-s1-standards',section:'Section 1',prompt:'Students trace c and h in shaving cream. Which support is the focus of this activity?',options:['Auditory','Kinesthetic/tactile','Visual'],answer:'Kinesthetic/tactile',why:'The physical movement and touch of tracing are the focus, even though students may also see the letters.',source:'User-provided WGU D669 Lesson 2.2 guided practice'},
      {id:'d669-s1-l2-multi-listen',topicId:'d669-s1-standards',section:'Section 1',prompt:'The teacher says words aloud, and students signal when they hear /ch/. Which support is the focus?',options:['Kinesthetic/tactile','Visual','Auditory'],answer:'Auditory',why:'Students listen for the /ch/ sound; the thumbs signal communicates their answer.',source:'User-provided WGU D669 Lesson 2.2 guided practice'},
      {id:'d669-s1-l2-multi-sort',topicId:'d669-s1-standards',section:'Section 1',prompt:'Students sort printed words into groups with and without /ch/. Which support does the supplied lesson identify as the focus?',options:['Visual','Auditory','Kinesthetic/tactile'],answer:'Visual',why:'The lesson identifies seeing and comparing the printed word patterns as the focus. Moving the cards may also add touch.',source:'User-provided WGU D669 Lesson 2.2 guided practice'},
      {id:'d669-s1-l2-word-map-cat',topicId:'d669-s1-standards',section:'Section 1',prompt:'Which sequence connects auditory, kinesthetic and visual work when mapping the word “cat”?',options:['Say cat and segment /k/ /ă/ /t/, tap three sounds, then map c-a-t to those sounds','Memorize the shape of cat without hearing its sounds','Assign each child a permanent learning style','Copy the word without discussing sounds'],answer:'Say cat and segment /k/ /ă/ /t/, tap three sounds, then map c-a-t to those sounds',why:'Students hear and say phonemes, mark each sound with a movement, then see the matching graphemes. The sound /k/ maps to the letter c in cat.',source:'Original Majick practice based on user-provided D669 Lesson 2.2'},
      {id:'d669-s1-l2-learning-styles',topicId:'d669-s1-standards',section:'Section 1',prompt:'Which claim is supported by the lesson’s distinction between multisensory instruction and learning styles?',options:['Use purposeful sight, sound and touch to support a skill; do not label children as fixed visual, auditory or kinesthetic learners','Always teach a student only through their preferred sense','Every multisensory activity automatically teaches decoding','Avoid modeling sounds if students can touch letters'],answer:'Use purposeful sight, sound and touch to support a skill; do not label children as fixed visual, auditory or kinesthetic learners',why:'Combining useful representations and actions differs from matching instruction to an assumed fixed learning style.',source:'Original Majick practice based on user-provided D669 Lesson 2.2'}
    ],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['d669-s1-standards','d669-s2-reading','d669-s3-communication','d669-s4-genres','d669-s5-writing']},
    studySections:[
      {id:'d669-section-1',title:'Section 1: Analyzes Standards and Resources in Literacy',competency:'2068.1.1',
       lessons:[
         {title:'Lesson 1: Standards Alignment for Literacy',topics:['1.1 Introduction to Literacy Education','1.2 Instructional Considerations and Structured Literacy','1.3 Literacy Standards','1.4 Standards Across the School Year'],
          sublessons:[{id:'d669-s1-l1-1',title:'Lesson 1.1: Introduction to Literacy Education',
           keyIdeas:['Literacy has shaped access to knowledge and participation in society; printing expanded access to written material.','Whole language emphasizes meaning and context. Balanced literacy combines some phonics with meaningful texts. Structured literacy explicitly and systematically teaches foundational skills and language structure.','Dyslexia is not a visual reversal problem or a lack of effort. Teach phonemic awareness and phonics directly, with a planned sequence and feedback.','Reading involves coordinated visual, language, sound, speech and motor processes; no single brain region teaches a child to read.'],
           reflection:['How was I taught to read?','Which assumptions about literacy instruction should I reconsider?'],
           visual:{src:'https://assets.wgu.edu/25076e90e604c9e34a82a472f0912c55',alt:'WGU Reading Brain figure with frontal, temporal, parietal and occipital lobes, Broca’s area, planum temporale and cerebellum.'},
           references:['WGU D669 Lesson 1.1, user-provided text','Hiebert (2023), Thinking Through Research and the Science of Reading','Hougen and Smartt (2012), Fundamentals of Literacy Instruction and Assessment, Chapter 1','Schwartz (2023), How Reading Policy Evolved in 2023 and What’s Ahead']},
           {id:'d669-s1-l1-2',title:'Lesson 1.2: Instructional Considerations and Structured Literacy',
            fourConsiderations:['Structured literacy','Selection of materials','Differentiation and high-leverage practices for all learners','Multi-tiered systems of support (MTSS)'],
            elements:['Phonology','Sound-symbol connections','Syllables','Morphology','Syntax','Semantics'],
            principles:['Systematic and cumulative','Explicit','Diagnostic'],
            keyIdeas:['Plan clear goals, select accessible and evidence-aligned materials, differentiate from observations and data, and monitor progress.','Structured literacy combines six language elements with three evidence-based teaching principles.','The Ladder of Reading describes different amounts of explicit code-based instruction and practice that readers may need. The supplied text does not include the original layer positions or percentages; consult the source figure before completing its drag-and-drop activity.'],
            guidedPractice:[{prompt:'Spelling-resource comparison: identify two of the four considerations used.',status:'Official answer key was not included in the supplied text.'},{prompt:'Match four classroom scenarios to the four considerations.',status:'Original answer options were not included in the supplied text.'},{prompt:'Complete the Ladder of Reading drag-and-drop.',status:'Use the figure on page 13; positions and percentages were not supplied.'}],
            references:['WGU D669 Lesson 1.2, user-provided text','Hougen and Smartt (2012), Fundamentals of Literacy Instruction and Assessment, Pre-K–6, pages 12–16 and Figure 1.1']},
           {id:'d669-s1-l1-3',title:'Lesson 1.3: Literacy Standards',
            keyIdeas:['Find the state’s current standards. Unpack each standard by identifying content (often the noun), skill (often the verb) and the expected demonstration.','Content standards state what to know or do; performance standards describe the level of achievement or evidence of mastery.','Bloom’s Taxonomy and depth-of-knowledge frameworks help consider the thinking demanded by a task. The supplied drag-and-drop omits its target categories, so do not guess the official sorting key.'],
            example:{standard:'Blend words with four or five phonemes when reading.',skill:'Blend',content:'Words with four or five phonemes',expectation:'Blend the sounds to read the words'},
            reflection:['Choose a current New York ELA standard for the grade you plan to teach. Identify its verb, noun and expected demonstration.','What evidence would show the student met the standard?'],
            resources:[{label:'New York State ELA standards',url:'https://www.nysed.gov/standards-instruction/english-language-arts'},{label:'U.S. Department of Education New York contacts',url:'https://www.ed.gov/about/contact-us/state-contacts/ny'}],
            references:['WGU D669 Lesson 1.3, user-provided attached text','Hougen and Smartt, Fundamentals of Literacy Instruction and Assessment, Chapter 4, pages 45–49']},
           {id:'d669-s1-l1-4',title:'Lesson 1.4: Standards Across the School Year',
            planningQuestions:['Which key literacy standards are prioritized?','Which supporting standards can be reinforced without formal assessment?','What content will be taught, and how will students apply it?','What are the unit goals, lesson targets and assessments?','What is the logical order of learning activities?','Which texts fit each lesson within the unit?','How will progress be measured and instruction adjusted?'],
            keyIdeas:['Plan coherent units across the year so new literacy skills build on familiar foundations.','Match the learning task and evidence of learning to the actual verb, content and expectation of the standard.','Figure 4.2 in the assigned reading illustrates a PK–2 progression of narrative writing skills.'],
            guidedPractice:[{prompt:'Choose an activity for demonstrating text organization and structure.',status:'Official answer feedback was not included in the supplied text.'},{prompt:'Choose an activity for finding a main idea and supporting details.',status:'Official answer feedback was not included in the supplied text.'}],
            references:['WGU D669 Lesson 1.4, user-provided text','Hougen and Smartt, Fundamentals of Literacy Instruction and Assessment, pages 50–53, Figure 4.2']},
           {id:'d669-s1-l1-review',title:'Lesson 1: Summary and Quiz',
            keyIdeas:['Research-based literacy instruction, curriculum and assessment should align with educational standards.','Structured literacy teaches language foundations systematically and explicitly, including phonology, morphology, syntax and semantics.','Unpacking standards helps teachers plan coherent instruction and assessment across the school year.'],
            next:'Lesson 2 explores literacy-rich environments and engaging experiences built on standards and skills.',
            quizIds:['d669-s1-l1-quiz-1','d669-s1-l1-quiz-2','d669-s1-l1-quiz-3'],
            summaryGraphic:'https://assets.wgu.edu/ad2fd0841354e10ed300224283a4fb56',
            references:['WGU D669 Lesson 1 summary graphic and quiz, user-provided text']}]},
         {title:'Lesson 2: Literacy-Rich Classroom Environments',topics:['2.1 Literacy-Rich Classrooms','2.2 Multisensory Activities'],
          learningObjective:'Select appropriate curricular resources for elementary standards alignment.',
          sublessons:[{id:'d669-s1-l2-intro',title:'Lesson 2: Introduction',
            keyIdeas:['Create an engaging environment for reading, writing, speaking and listening with auditory, visual and hands-on experiences.','Develop enjoyment of books and opportunities to hear rich text read aloud, build background knowledge, vocabulary and syntax, and connect letters and words to meaning.','Adapt activities and materials so all students can participate.'],
            quizIds:['d669-s1-l2-intro-1','d669-s1-l2-intro-2'],
            references:['WGU D669 Lesson 2 introduction and two guided questions, user-provided text']},
           {id:'d669-s1-l2-1',title:'Lesson 2.1: Literacy-Rich Classrooms',
            keyIdeas:['Provide print throughout the classroom: labels, anchor charts, word walls, literacy stations, writing centers and book displays.','Build a diverse classroom library with fiction and nonfiction, multiple genres and accessible texts.','Use reading, writing and relevant vocabulary across subjects, with talk and collaboration alongside teacher-led small groups.'],
            rich:{R:'Relevance: materials fit standards and students.',I:'Inclusive: learners are represented and encounter new perspectives.',C:'Creative: materials invite ideas and critical thinking.',H:'Hands-on: students can engage with resources in multiple ways.'},
            reflection:['How could I arrange the room to support independent reading and writing?','What will help students talk and work together?','Which varied texts and interactive writing spaces could I add?'],
            guidedPractice:'Plan a first-year teacher’s classroom setup that encourages reading and writing, and explain why each choice supports the goal.',
            visual:{src:'https://assets.wgu.edu/cd1fa91f6107180a51d8ca3afecd1157',alt:'WGU RICH graphic: Relevance, Inclusive, Creative and Hands-on.'},
            references:['WGU D669 Lesson 2.1, user-provided text','USBE Teaching and Learning (2023), Using Evidence Based Practices to Advance Learning']},
           {id:'d669-s1-l2-2',title:'Lesson 2.2: Multisensory Strategies',
            modalities:[{name:'Auditory',action:'Listen and speak',example:'Hear a word and identify /ch/.'},{name:'Visual',action:'See and read',example:'Compare printed words with and without ch.'},{name:'Kinesthetic/tactile',action:'Move and touch',example:'Trace c and h in shaving cream.'}],
            keyIdeas:['Combine sight, sound and touch purposefully to teach the same language skill. Do not assign each child a fixed sensory learning style.','The supplied /ch/ activity identifies tracing as kinesthetic/tactile, hearing words as auditory, and comparing printed words as visual. A real task can involve more than one sense.','Word mapping connects spoken sounds to print: hear and segment a word, tap or count its phonemes, then map the appropriate letters to each sound.'],
            reflection:['For cat, say the word, segment /k/ /ă/ /t/, tap three sounds, and map c-a-t. Which part is auditory, visual and kinesthetic?','Which multisensory action directly supports the reading skill, and which action might only add activity without teaching it?'],
            guidedPractice:['Trace c and h in shaving cream → kinesthetic/tactile.','Listen for /ch/ in spoken words → auditory.','Sort printed words with and without ch → visual focus in the supplied lesson.'],
            visual:{src:'https://assets.wgu.edu/7af25b83a60867f382edeb75709f5e05',alt:'WGU multisensory strategies graphic: visual, auditory, and kinesthetic/tactile.'},
            references:['WGU D669 Lesson 2.2, user-provided text','Birsh and Carreker (2018), Multisensory Teaching of Basic Language Skills, pages 46–48','Katelyn’s Learning Studio (2023), 11 Easy Word Mapping Activities']},
           {id:'d669-s1-l2-review',title:'Lesson 2: Summary',
            keyIdeas:['Give students frequent, enjoyable opportunities to interact with reading, writing, speaking and listening.','Choose resources that are relevant, inclusive, creative and hands-on (RICH).','Connect purposeful auditory, visual and kinesthetic/tactile activities to a clear literacy goal and adapt access for different learners.'],
            summaryGraphic:'https://assets.wgu.edu/28fb9d2b4c302c9fef76e35103ec5f83',
            reflection:['Which part of my classroom already supports each RICH element?','How would I teach one sound–symbol skill using hearing, seeing and touching without assigning a fixed learning style?'],
            references:['WGU D669 Lesson 2 summary graphic, user-provided text']}]}
       ],
       learningObjective:'Analyze reading instruction for alignment to a given content standard.',
       summary:'Lessons 1–2.2: align standards, build literacy-rich environments and connect sounds, print and movement deliberately.',
       concepts:['d669-s1-standards'],
       rows:[
         ['History of literacy','Reading and writing have shaped access to learning, information and civic participation. The printing press expanded access to books.','Reflect: Who had access to literacy, and how did that access change?'],
         ['Rethinking assumptions','Reading is learned through instruction that connects spoken language, print and meaning. Literacy also includes interpreting digital and visual information.','Your experience as a reader may differ from what current research recommends for beginners.'],
         ['Whole language and balanced literacy','Whole language stresses meaning and context. Balanced literacy mixes phonics with meaningful reading; the amount and sequence of explicit phonics can vary.','Compare these approaches with a clearly sequenced, explicit foundational-skills lesson.'],
         ['Structured literacy','Teach phonemic awareness, decoding, encoding and language structure through an explicit, systematic sequence with modeling, practice and feedback.','Phonology, orthography, morphology, syntax, semantics and discourse all contribute to reading.'],
         ['Dyslexia','Dyslexia is not caused by seeing letters backward or by a child failing to try. Explicit and systematic foundational reading instruction supports students with dyslexia.','Do not treat a visual reversal myth as a diagnosis.'],
         ['The reading brain','Visual processing, sound–letter mapping, speech and language comprehension work together. The WGU figure labels the frontal, temporal, parietal and occipital lobes, Broca’s area, planum temporale and cerebellum.','The figure is a learning aid; avoid assigning an entire reading skill to one lobe.'],
         ['Reflect','How was I taught to read? Which beliefs about literacy instruction might I need to reconsider?','Use the two guided true-or-false questions to check the dyslexia and discovery-learning myths.'],
         ['Lesson 1.2 • Four planning considerations','Structured literacy; selection of materials; differentiation and high-leverage practices; and MTSS. Set goals, choose accessible evidence-aligned resources, respond to learner needs and check progress.','A colorful activity is not enough if it is inaccessible or does not teach the needed skill.'],
         ['Lesson 1.2 • Six language elements','Phonology = sound patterns; sound-symbol = letters and sounds; syllables = vowel-centered word parts; morphology = meaningful word parts; syntax = sentence structure; semantics = meaning.','Try to name the specific language element being taught in any classroom example.'],
         ['Lesson 1.2 • Three teaching principles','Systematic and cumulative = planned sequence building on prior learning; explicit = clear modeling, guided practice and feedback; diagnostic = ongoing checks that guide targeted teaching.','These principles describe how to teach the language elements.'],
         ['Lesson 1.2 • Classroom decisions','Use assessment to identify a need, adjust materials and tasks, and provide additional support within MTSS when core instruction is not enough.','Differentiation can vary the task while preserving the learning goal.'],
         ['Lesson 1.2 • Ladder of Reading','Different learners need different amounts of explicit phonics instruction and practice. Use the source figure on page 13 to complete the official drag-and-drop.','The pasted text omits the layer positions and percentages, so the app does not guess them.'],
         ['Lesson 1.2 • Guided checks','Review the spelling-material comparison and four classroom scenarios from your course. Then try the original Majick questions for systematic, diagnostic, material and MTSS decisions.','The supplied copy omits some official answer choices; app-generated practice is labeled separately.'],
         ['Lesson 1.3 • Find current standards','Use the New York State Education Department ELA standards page to find the grade and standard you are teaching. A federal state-contacts page helps locate the state department.','Check the current grade-level source before planning.'],
         ['Lesson 1.3 • Unpack a standard','Identify the content (noun), required skill (verb) and what students must demonstrate. Example: “Blend words with four or five phonemes when reading” asks students to blend those sounds to read words.','Align your lesson and assessment with the exact expectation.'],
         ['Lesson 1.3 • Content and performance','Content standards describe knowledge and skills to learn; performance standards specify proficiency or evidence of achievement. Bloom’s Taxonomy helps consider the thinking required.','The pasted official sorting activity omits target categories; do not invent its answer key.'],
         ['Lesson 1.4 • Seven planning questions','Prioritize standards; identify supporting standards; define content and application; set unit and lesson targets and assessments; sequence activities; select texts; measure progress and adjust instruction.','Use these questions when reviewing each unit across the school year.'],
         ['Lesson 1.4 • Align the activity','If the standard asks students to explain text organization, ask them to show how its sections connect. If it asks for main idea and details, require evidence for the idea.','A related activity is not necessarily evidence of the specific skill in the standard.'],
         ['Lesson 1 • Three takeaways','Align research-based literacy instruction and assessments to standards. Teach language foundations explicitly and systematically. Unpack standards to plan instruction across the year.','Use the three source quiz questions to check your understanding before Lesson 2.'],
         ['Lesson 1 • Next steps','Lesson 2 turns these standards and skills into literacy-rich classroom environments and engaging learning experiences.','Keep the standard and the evidence of learning visible when choosing activities.'],
         ['Lesson 2 • Literacy-rich environment','Provide meaningful reading, writing, speaking and listening across subjects. Connect letters and sounds to meaning; build enjoyment of texts, background knowledge, vocabulary and syntax.','Use auditory, visual and hands-on activities while adapting to learner needs.'],
         ['Lesson 2.1 • Classroom setup','Use labels, anchor charts, word walls, literacy stations, writing centers and book displays. Model language, read aloud, and make room for discussion and small-group instruction.','A regular library field trip is valuable but is not a classroom setup component.'],
         ['Lesson 2.1 • Libraries and subjects','Offer diverse fiction and nonfiction at accessible levels, across genres and cultures. Use texts and vocabulary in science, social studies and other subjects.','Ask whose experiences students see in the collection and what new perspectives they encounter.'],
         ['Lesson 2.1 • RICH','R = Relevance to standards and students; I = Inclusive representation and perspectives; C = Creative ideas and thinking; H = Hands-on access to multisensory activities.','Use RICH to evaluate a classroom resource, then try the four original Majick matching questions.'],
         ['Lesson 2.1 • Plan your space','Choose places for independent reading, shared talk and writing. Include varied books and interactive writing surfaces. Explain how each choice supports a literacy goal.','Reflect on access for English language learners and other students.'],
         ['Lesson 2.2 • Three modalities','Auditory = listening and speaking; visual = seeing and reading; kinesthetic/tactile = moving and touching. Combine them when each step reinforces the target skill.','This does not require labeling children as fixed visual, auditory or kinesthetic learners.'],
         ['Lesson 2.2 • /ch/ activities','Tracing c and h in shaving cream emphasizes touch/movement. Hearing /ch/ in spoken words emphasizes listening. Comparing printed word patterns emphasizes seeing.','One activity can use several senses; identify the focus named in the question.'],
         ['Lesson 2.2 • Map cat','Say cat and listen for /k/ /ă/ /t/. Tap three phonemes. Place c, a and t under their matching sounds, then blend and read cat.','Auditory: hear/say sounds. Kinesthetic: tap/count. Visual: see letter–sound matches.'],
         ['Lesson 2.2 • Reflect','Which sight, sound and movement steps would you use for cat, and how does each step support sound–symbol mapping?','Use multisensory actions intentionally; activity alone does not guarantee learning.'],
         ['Lesson 2 • Three takeaways','Offer frequent, enjoyable literacy interaction. Choose relevant, inclusive, creative and hands-on resources. Combine auditory, visual and kinesthetic/tactile actions in service of a clear literacy goal.','Adapt the activities so all learners can participate and explain what each action helps them learn.']
       ],
       visual:{src:'https://assets.wgu.edu/25076e90e604c9e34a82a472f0912c55',alt:'WGU Reading Brain figure, showing labeled left-hemisphere regions associated with language and reading.'},
       links:[{label:'New York State ELA standards',url:'https://www.nysed.gov/standards-instruction/english-language-arts'},{label:'U.S. Department of Education New York contacts',url:'https://www.ed.gov/about/contact-us/state-contacts/ny'},{label:'WGU RICH classroom graphic',url:'https://assets.wgu.edu/cd1fa91f6107180a51d8ca3afecd1157'},{label:'WGU RICH activity',url:'https://lrps.wgu.edu/provision/530024293'},{label:'USBE classroom video',url:'https://www.youtube.com/watch?v=zVqJSUYy9yA&t=3s'},{label:'WGU multisensory strategies graphic',url:'https://assets.wgu.edu/7af25b83a60867f382edeb75709f5e05'},{label:'Word mapping activity video',url:'https://www.youtube.com/watch?v=aeQjBUoXMx8'},{label:'WGU Lesson 2 summary graphic',url:'https://assets.wgu.edu/28fb9d2b4c302c9fef76e35103ec5f83'}],
       practice:[
         {question:'What is a key component of structured literacy instruction?',answer:'Integrating explicit, systematic teaching of decoding and encoding skills.'},
         {question:'How do standards help teachers keep lessons consistent throughout the school year?',answer:'By giving teachers a clear guide on what to teach and when.'}
       ]},
      {id:'d669-section-2',title:'Section 2: Foundations of Reading',competency:'2068.1.2'},
      {id:'d669-section-3',title:'Section 3: Analyzes Elements of Literacy',competency:'2068.1.3'},
      {id:'d669-section-4',title:'Section 4: Describes Key Features of Texts Across Genres',competency:'2068.1.4'},
      {id:'d669-section-5',title:'Section 5: Analyzes Concepts and Structures in Writing',competency:'2068.1.5'}
    ],
    sources:[{title:'WGU D669 course introduction and Section 1 materials',type:'user-provided',assessment:'objective'}],
    localGenerated:true,catalogSeed:true
  },
  D756:{
    id:'D756',
    title:'IEP Collaboration and Communication',
    version:'majick-d756-2026-11',
    concepts:[
      {id:'d756-s1-collaboration',title:'Collaboration and Communication',section:'Section 1',priority:'core'},
      {id:'d756-s2-resources',title:'Collaboration and Resources',section:'Section 2',priority:'core'}
    ],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['d756-s1-collaboration','d756-s2-resources']},
    studySections:[],sources:[],localGenerated:true,catalogSeed:true
  }
};
const E=s=>{try{return esc(String(s??''))}catch(_){return String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}};
const clone=x=>{try{return JSON.parse(JSON.stringify(x))}catch(_){return x}};

function blankProgress(){
  if(window.MajickStateCore?.blankProgress)return window.MajickStateCore.blankProgress();
  return {
    answers:[],explanations:[],repair:[],spacedQueue:[],charms:[],cosmetics:[],
    questionMemory:[],sessionHistory:[],masteryRewarded:[],helpHistory:[],familyMemory:[],
    urgentRepair:[],v5SessionHistory:[],errorTags:[],strategyHistory:[],
    distractorHistory:{},flaggedQuestions:{},masteryProofs:{},sourceCoverage:{},
    questionExposure:{},aiCache:{},
    streak:0,lastDay:'',bossWins:0,xp:0,crystals:0,chests:0,bestCombo:0,
    aiGeneratedCount:0,petAbilityUses:0,eliminationWins:0,voicePractices:0,
    dailyClaimed:'',weeklyClaimed:'',
    inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0}
  };
}
function normalizeProgressRow(row,cid=''){
  if(window.MajickStateCore?.normalizeProgressRow){
    return window.MajickStateCore.normalizeProgressRow(row,cid);
  }
  const p=(row&&typeof row==='object'&&!Array.isArray(row))?row:blankProgress();
  const arrays=[
    'answers','explanations','repair','spacedQueue','charms','cosmetics',
    'questionMemory','sessionHistory','masteryRewarded','helpHistory','familyMemory',
    'urgentRepair','v5SessionHistory','errorTags','strategyHistory'
  ];
  for(const key of arrays)p[key]=Array.isArray(p[key])?p[key]:[];
  const objects=['distractorHistory','flaggedQuestions','masteryProofs','sourceCoverage','questionExposure','aiCache'];
  for(const key of objects)p[key]=(p[key]&&typeof p[key]==='object'&&!Array.isArray(p[key]))?p[key]:{};
  p.inventory=(p.inventory&&typeof p.inventory==='object'&&!Array.isArray(p.inventory))
    ?Object.assign({streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0},p.inventory)
    :{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0};
  for(const key of ['streak','bossWins','bestCombo','aiGeneratedCount','petAbilityUses','eliminationWins','voicePractices']){
    p[key]=Number(p[key]||0);
  }
  for(const key of SHARED)p[key]=Number(p[key]||0);
  p.lastDay=typeof p.lastDay==='string'?p.lastDay:'';
  p.dailyClaimed=typeof p.dailyClaimed==='string'?p.dailyClaimed:'';
  p.weeklyClaimed=typeof p.weeklyClaimed==='string'?p.weeklyClaimed:'';
  if(cid)p.courseId=cid;
  return p;
}
function normalizeAllProgress(){
  if(!window.S)return;
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};
  for(const [cid,row] of Object.entries(S.progress)){
    S.progress[cid]=normalizeProgressRow(row,cid);
  }
  for(const cid of Object.keys(S.courses||{})){
    S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
  }
}
function activeProgress(){
  if(!window.S)return null;
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};
  const cid=S.activeCourse;
  if(!cid)return null;
  S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
  return S.progress[cid];
}
function mergeUniqueRows(a,b){
  const out=[],seen=new Set();
  for(const row of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){
    const key=String(row?.id||row?.qid||JSON.stringify(row));
    if(seen.has(key))continue;
    seen.add(key);out.push(row);
  }
  return out;
}
function migrateLegacyAssessmentCourse(){
  if(!window.S)return;
  const legacyId='PMFC',targetId='D755';
  const legacyCourse=S.courses?.[legacyId];
  const existingCourse=S.courses?.[targetId];

  if(legacyCourse){
    if(!existingCourse){
      S.courses[targetId]=legacyCourse;
    }else{
      existingCourse.questionBank=mergeUniqueRows(legacyCourse.questionBank,existingCourse.questionBank);
      existingCourse.concepts=mergeUniqueRows(legacyCourse.concepts,existingCourse.concepts);
      existingCourse.misconceptionCatalog=mergeUniqueRows(legacyCourse.misconceptionCatalog,existingCourse.misconceptionCatalog);
      existingCourse.studySections=mergeUniqueRows(legacyCourse.studySections,existingCourse.studySections);
      existingCourse.sources=mergeUniqueRows(legacyCourse.sources,existingCourse.sources);
      existingCourse.glossary=Object.assign({},legacyCourse.glossary||{},existingCourse.glossary||{});
    }
    S.courses[targetId].id=targetId;
    S.courses[targetId].title='Assessment for Special Education';
    S.courses[targetId].catalogSeed=false;
    delete S.courses[legacyId];
  }

  if(S.progress?.[legacyId]){
    if(!S.progress[targetId])S.progress[targetId]=S.progress[legacyId];
    else{
      const target=S.progress[targetId],legacy=S.progress[legacyId];
      for(const key of ['answers','explanations','repair','spacedQueue','charms','cosmetics','questionMemory','sessionHistory','masteryRewarded','helpHistory','familyMemory','urgentRepair','v5SessionHistory','errorTags','strategyHistory']){
        target[key]=mergeUniqueRows(legacy[key],target[key]);
      }
      target.streak=Math.max(Number(target.streak||0),Number(legacy.streak||0));
      target.lastDay=target.lastDay||legacy.lastDay||'';
    }
    delete S.progress[legacyId];
  }

  S.majickCourseRecords=S.majickCourseRecords||{};
  if(S.majickCourseRecords[legacyId]){
    if(!S.majickCourseRecords[targetId])S.majickCourseRecords[targetId]=S.majickCourseRecords[legacyId];
    S.majickCourseRecords[targetId].courseId=targetId;
    S.majickCourseRecords[targetId].title='Assessment for Special Education';
    delete S.majickCourseRecords[legacyId];
  }

  S.majickCourseUI=S.majickCourseUI||{};
  if(S.majickCourseUI[legacyId]&&!S.majickCourseUI[targetId])S.majickCourseUI[targetId]=S.majickCourseUI[legacyId];
  delete S.majickCourseUI[legacyId];

  if(S.activeCourse===legacyId)S.activeCourse=targetId;
}

function ensure(){
  if(!window.S)return;
  S.courses=(S.courses&&typeof S.courses==='object'&&!Array.isArray(S.courses))?S.courses:{};
  S.progress=(S.progress&&typeof S.progress==='object'&&!Array.isArray(S.progress))?S.progress:{};

  migrateLegacyAssessmentCourse();

  // Seed official courses without replacing an existing learner-owned version
  // and without changing the user's active class.
  for(const [cid,template] of Object.entries(COURSE_CATALOG)){
    if(!S.courses[cid])S.courses[cid]=clone(template);
  }
  // Earlier D669 starters may already exist in local storage. Add only the
  // missing official outline sections; keep learner notes and progress intact.
  const d669=S.courses.D669;
  if(d669){
    const template=COURSE_CATALOG.D669;
    d669.studySections=Array.isArray(d669.studySections)?d669.studySections:[];
    const existing=new Set(d669.studySections.map(row=>String(row?.id||'')));
    for(const section of template.studySections){
      if(!existing.has(section.id))d669.studySections.push(clone(section));
    }
    d669.concepts=mergeUniqueRows(d669.concepts,template.concepts);
    d669.sources=mergeUniqueRows(d669.sources,template.sources);
    d669.questionBank=mergeUniqueRows(d669.questionBank,template.questionBank);
    d669.glossary=Object.assign({},template.glossary,d669.glossary||{});
    const sectionOne=d669.studySections.find(row=>row?.id==='d669-section-1');
    if(sectionOne){
      sectionOne.rows=Array.isArray(sectionOne.rows)?sectionOne.rows:[];
      const present=new Set(sectionOne.rows.map(row=>String(row?.[0]||'')));
      for(const row of template.studySections[0].rows){
        if(!present.has(row[0]))sectionOne.rows.push(clone(row));
      }
      if(!sectionOne.summary||sectionOne.summary.startsWith('Lesson 1.1:')||sectionOne.summary.startsWith('Lessons 1.1–')||sectionOne.summary.startsWith('Lesson 1:')||sectionOne.summary.startsWith('Lessons 1–2.1:')) sectionOne.summary=template.studySections[0].summary;
      sectionOne.visual=sectionOne.visual||clone(template.studySections[0].visual);
      sectionOne.links=mergeUniqueRows(sectionOne.links,template.studySections[0].links);
      sectionOne.concepts=mergeUniqueRows(sectionOne.concepts,template.studySections[0].concepts);
      sectionOne.lessons=Array.isArray(sectionOne.lessons)?sectionOne.lessons:[];
      const first=sectionOne.lessons.find(row=>row?.title==='Lesson 1: Standards Alignment for Literacy');
      if(first){
        first.sublessons=Array.isArray(first.sublessons)?first.sublessons:[];
        for(const sublesson of template.studySections[0].lessons[0].sublessons){
          if(!first.sublessons.some(row=>row?.id===sublesson.id))first.sublessons.push(clone(sublesson));
        }
      }
      const second=sectionOne.lessons.find(row=>row?.title==='Lesson 2: Literacy-Rich Classroom Environments');
      if(second){
        second.learningObjective=second.learningObjective||template.studySections[0].lessons[1].learningObjective;
        second.sublessons=Array.isArray(second.sublessons)?second.sublessons:[];
        for(const sublesson of template.studySections[0].lessons[1].sublessons){
          if(!second.sublessons.some(row=>row?.id===sublesson.id))second.sublessons.push(clone(sublesson));
        }
      }
    }
    if(!d669.preassessmentProfile?.priorityConcepts?.length){
      d669.preassessmentProfile=clone(template.preassessmentProfile);
    }
  }
  if(!S.courses?.[S.activeCourse]){
    S.activeCourse=S.courses?.D755?'D755':Object.keys(S.courses||{})[0]||'D755';
  }
  normalizeAllProgress();
  S.majickCourseRecords=S.majickCourseRecords||{};
  S.majickCourseUI=S.majickCourseUI||{};
  if(!S.majickAccount){
    const p=activeProgress()||{};
    S.majickAccount={
      xp:Number(p.xp||0),crystals:Number(p.crystals||0),chests:Number(p.chests||0),
      createdAt:new Date().toISOString(),schemaVersion:1
    };
  }
  for(const [cid,c] of Object.entries(S.courses)){
    const p=S.progress[cid]=normalizeProgressRow(S.progress[cid],cid);
    p.courseId=cid;
    if(!p.__majickSharedReady){
      for(const k of SHARED)p[k]=Number(S.majickAccount[k]||0);
      p.__majickSharedReady=true;
    }
    S.majickCourseRecords[cid]=S.majickCourseRecords[cid]||{
      courseId:cid,
      title:c?.title||cid,
      status:c?.catalogSeed?'available':'active',
      startedAt:c?.catalogSeed?null:new Date().toISOString(),
      passedAt:null,
      completionXp:0,
      paceMinWeeks:COURSE_PACE.minWeeks,
      paceTargetWeeks:COURSE_PACE.targetWeeks,
      paceMaxWeeks:COURSE_PACE.maxWeeks
    };
    const paceRecord=S.majickCourseRecords[cid];
    paceRecord.paceMinWeeks=Math.max(1,Number(paceRecord.paceMinWeeks||COURSE_PACE.minWeeks));
    paceRecord.paceTargetWeeks=Math.max(paceRecord.paceMinWeeks,Number(paceRecord.paceTargetWeeks||COURSE_PACE.targetWeeks));
    paceRecord.paceMaxWeeks=Math.max(paceRecord.paceTargetWeeks,Number(paceRecord.paceMaxWeeks||COURSE_PACE.maxWeeks));
  }
}
function captureAccount(){
  ensure();
  const p=activeProgress();if(!p)return;
  for(const k of SHARED){
    const incoming=Number(p[k]??S.majickAccount[k]??0);
    if(k==='xp'){
      const current=Number(S.majickAccount?.xp||0);
      const high=Number(S.majickAccount?.xpHighWater||S.majickAccount?.lifetimeXpHighWater||0);
      S.majickAccount.xp=Math.max(current,high,Number.isFinite(incoming)?incoming:0);
      S.majickAccount.xpHighWater=Math.max(high,S.majickAccount.xp);
      S.majickAccount.lifetimeXpHighWater=S.majickAccount.xpHighWater;
    }else{
      S.majickAccount[k]=Number.isFinite(incoming)?incoming:Number(S.majickAccount[k]||0);
    }
  }
}
function mirrorAccount(){
  ensure();
  for(const [cid,row] of Object.entries(S.progress||{})){
    const p=S.progress[cid]=normalizeProgressRow(row,cid);
    for(const k of SHARED)p[k]=Number(S.majickAccount?.[k]||0);
    p.__majickSharedReady=true;
  }
}
function saveCourseUI(cid){
  if(!cid)return;
  ensure();
  S.majickCourseUI[cid]={
    grimoire:clone(S.v3311?.grimoire||{page:0,bookmarks:[],notes:{},remember:{},search:''}),
    grimoirePage:Number(S.v3311Page||0)
  };
}
function restoreCourseUI(cid){
  ensure();
  const ui=S.majickCourseUI[cid]||{grimoire:{page:0,bookmarks:[],notes:{},remember:{},search:''},grimoirePage:0};
  S.v3311=S.v3311||{};
  S.v3311.grimoire=clone(ui.grimoire);
  S.v3311Page=Number(ui.grimoirePage||0);
}
const baseSave=window.save;
window.save=function(){
  ensure();
  captureAccount();
  mirrorAccount();
  saveCourseUI(S.activeCourse);
  return baseSave();
};

window.switchCourse=function(id){
  ensure();
  if(!S.courses?.[id])return;
  saveCourseUI(S.activeCourse);
  captureAccount();mirrorAccount();
  S.activeCourse=id;
  const record=S.majickCourseRecords?.[id];
  if(record?.status==='available'){
    record.status='active';
    record.startedAt=record.startedAt||new Date().toISOString();
  }
  S.progress[id]=S.progress[id]||blankProgress();
  for(const k of SHARED)S.progress[id][k]=Number(S.majickAccount[k]||0);
  S.progress[id].__majickSharedReady=true;
  restoreCourseUI(id);
  window.session=null;
  S.screen='home';
  window.save();
  window.render();
};

function createCourse(code,title){
  ensure();
  code=String(code||'').trim().toUpperCase().replace(/[^A-Z0-9-]/g,'').slice(0,24);
  title=String(title||'').trim();
  if(!code)throw new Error('Enter the WGU course code.');
  if(!title)throw new Error('Enter the course title.');
  if(S.courses[code])throw new Error(code+' is already in Majick Studies. Switch to that course instead.');
  S.courses[code]={
    id:code,title,version:'majick-course-1',
    concepts:[{id:'uploaded-notes',title:'Uploaded Course Material',section:'course',priority:'core'}],
    glossary:{},questionBank:[],misconceptionCatalog:[],
    preassessmentProfile:{priorityConcepts:['uploaded-notes']},
    studySections:[],sources:[],localGenerated:true
  };
  S.progress[code]=blankProgress();
  for(const k of SHARED)S.progress[code][k]=Number(S.majickAccount[k]||0);
  S.progress[code].__majickSharedReady=true;
  S.majickCourseRecords[code]={
    courseId:code,title,status:'active',startedAt:new Date().toISOString(),
    passedAt:null,completionXp:0,
    paceMinWeeks:COURSE_PACE.minWeeks,
    paceTargetWeeks:COURSE_PACE.targetWeeks,
    paceMaxWeeks:COURSE_PACE.maxWeeks
  };
  saveCourseUI(S.activeCourse);
  S.activeCourse=code;
  restoreCourseUI(code);
  S.screen='addmaterial';window.session=null;
  window.save();window.render();
  try{rewardToast('✦ New Course Started',code+' begins with a fresh 0-day class streak. Your Majick XP stays with you.')}catch(_){}
}
function passCourse(){
  ensure();
  const cid=S.activeCourse,c=S.courses?.[cid],r=S.majickCourseRecords?.[cid];
  if(!c||!r)return;
  if(r.status==='passed'){celebratePass(c,r,false);return;}
  if(!confirm('Mark '+cid+' • '+c.title+' as passed? This keeps its course record and awards '+PASS_XP+' Majick XP.'))return;
  captureAccount();
  S.majickAccount.xp=Number(S.majickAccount.xp||0)+PASS_XP;
  r.status='passed';r.passedAt=new Date().toISOString();r.completionXp=PASS_XP;
  const p=S.progress[cid]||(S.progress[cid]=blankProgress());
  p.completed=true;p.completedAt=r.passedAt;
  mirrorAccount();
  window.save();
  celebratePass(c,r,true);
  document.dispatchEvent(new CustomEvent('majick:celebrate',{detail:{type:'course',course:cid,key:'course-pass:'+cid,verified:true}}));
  window.render();
}
function celebratePass(c,r,newAward){
  try{rewardToast('🎓 Course Passed!',c.id+' completed'+(newAward?' • +'+PASS_XP+' XP':''));}catch(_){}
  const old=document.querySelector('.v3316PassOverlay');if(old)old.remove();
  const d=document.createElement('div');d.className='v3316PassOverlay';
  d.innerHTML='<div class="v3316PassCard"><div class="v3316PassSigil">✦</div><div class="eyebrow">COURSE COMPLETE</div><h2>You passed '+E(c.id)+'!</h2><h3>'+E(c.title)+'</h3><p>'+ (newAward?'+'+PASS_XP+' Majick XP has been added to your overall experience. ':'') +'This class keeps its own history. Your next class starts a brand-new streak.</p><div class="v3316PassActions"><button class="btn primary" id="v3316NewAfterPass">Start My Next Class</button><button class="btn ghost" id="v3316ClosePass">Keep Celebrating</button></div></div>';
  document.body.appendChild(d);
  d.querySelector('#v3316ClosePass')?.addEventListener('click',()=>d.remove());
  d.querySelector('#v3316NewAfterPass')?.addEventListener('click',()=>{d.remove();navigate('addmaterial')});
}
function record(cid){ensure();return S.majickCourseRecords?.[cid]||null}
function currentStatus(){
  ensure();const cid=S.activeCourse,c=S.courses?.[cid],p=S.progress?.[cid]||blankProgress(),r=record(cid);
  return {courseId:cid,title:c?.title||cid,status:r?.status||'active',streak:Number(p.streak||0),answers:(p.answers||[]).length,passedAt:r?.passedAt||null};
}
function panelHTML(){
  const x=currentStatus();
  return '<section class="v3316CourseCenter">'+
    '<div class="v3316CourseHead"><div><div class="eyebrow">COURSE CENTER • SEPARATE CLASSES</div><h2>'+E(x.courseId)+' • '+E(x.title)+'</h2><p>Each class keeps its own notes, questions, mistakes, mastery, readiness, and streak. Majick XP and Guardian growth belong to you and travel forward.</p></div><span class="v3316CourseStatus '+(x.status==='passed'?'passed':'')+'">'+(x.status==='passed'?'✓ PASSED':'CURRENT CLASS')+'</span></div>'+
    '<div class="v3316CourseStats"><span><b>'+x.streak+'</b> class streak</span><span><b>'+x.answers+'</b> answers in this class</span><span><b>'+Number(S.majickAccount?.xp||0)+'</b> overall Majick XP</span></div>'+
    '<div class="v3316CourseActions"><button class="btn '+(x.status==='passed'?'good':'violet')+'" id="v3316PassCourse" '+(x.status==='passed'?'disabled':'')+'>'+(x.status==='passed'?'✓ Course Passed':'🎓 I Passed This Course')+'</button></div>'+
    '<details class="v3316NewCourse"><summary>＋ Add / Start a New WGU Course</summary><div class="v3316NewCourseGrid"><label>Course code<input id="v3316CourseCode" placeholder="D772"></label><label>Course title<input id="v3316CourseTitle" placeholder="Statistical Data Literacy"></label><button class="btn primary" id="v3316CreateCourse">Create Course & Start Fresh Streak</button></div><p class="v3316CourseNote">Creating a course starts its academic record at zero. Your overall experience and Guardians remain with you.</p></details>'+
  '</section>';
}
function bindPanel(){
  document.getElementById('v3316PassCourse')?.addEventListener('click',passCourse);
  document.getElementById('v3316CreateCourse')?.addEventListener('click',()=>{
    try{createCourse(document.getElementById('v3316CourseCode')?.value,document.getElementById('v3316CourseTitle')?.value)}
    catch(e){alert(e.message)}
  });
}
function decorateSelector(){
  ensure();
  const sel=document.querySelector('.courseSelect');if(!sel)return;

  // The shell may have been rendered from an older course list. Reconcile the
  // selector with the authoritative course registry every time it appears.
  for(const [cid,c] of Object.entries(S.courses||{})){
    let option=[...sel.options].find(o=>o.value===cid);
    if(!option){
      option=document.createElement('option');
      option.value=cid;
      sel.appendChild(option);
    }
    const r=S.majickCourseRecords?.[cid];
    const prefix=r?.status==='passed'?'✓ ':r?.status==='available'?'＋ ':'';
    option.textContent=prefix+cid+' • '+(c?.title||cid);
    option.selected=cid===S.activeCourse;
  }
}

ensure();mirrorAccount();
// Reconcile the already-rendered dropdown now and after every subsequent render.
// No course progress or reward data is changed by this view-only synchronization.
const previousCourseSelectorRender=window.render;
if(typeof previousCourseSelectorRender==='function'){
  window.render=function(){
    const result=previousCourseSelectorRender.apply(this,arguments);
    decorateSelector();
    return result;
  };
}
decorateSelector();

async function migrateLegacyMaterialSources(){
  try{
    if(!window.MajickMaterialStore?.migrateCourseId)return;
    const result=await window.MajickMaterialStore.migrateCourseId('PMFC','D755');
    if(result?.migrated){
      const d755=S.courses?.D755;
      if(d755)await window.MajickMaterialStore.syncQuestions(d755,'D755');
      try{window.save()}catch(_){}
    }
  }catch(e){console.warn('Majick D755 Notes Forge migration',e)}
}
migrateLegacyMaterialSources();

const materialPage=window.AddStudyMaterialPage;
const oldMaterialRender=materialPage?.render;
const oldMaterialBind=materialPage?.bind;
if(materialPage&&typeof oldMaterialRender==='function'){
  materialPage.render=function(){return panelHTML()+oldMaterialRender.call(materialPage)};
  materialPage.bind=function(){
    if(typeof oldMaterialBind==='function')oldMaterialBind.call(materialPage);
    bindPanel();
  };
  window.v3315BindStudyMaterialPage=materialPage.bind;
}
window.MajickCourseManager={COURSE_PACE,ensure,captureAccount,mirrorAccount,normalizeProgressRow,normalizeAllProgress,migrateLegacyAssessmentCourse,migrateLegacyMaterialSources,createCourse,passCourse,currentStatus,panelHTML,bindPanel,decorateSelector,record,PASS_XP,COURSE_CATALOG};
})();
