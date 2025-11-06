<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subject;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            // Programming Languages
            [
                'name' => 'JavaScript',
                'description' => 'JavaScript programming language and ecosystem including Node.js, React, Vue, etc.'
            ],
            [
                'name' => 'Python',
                'description' => 'Python programming language, Django, Flask, data science, and machine learning'
            ],
            [
                'name' => 'Java',
                'description' => 'Java programming language, Spring Boot, Android development'
            ],
            [
                'name' => 'PHP',
                'description' => 'PHP programming language, Laravel, Symfony, WordPress development'
            ],
            [
                'name' => 'C#',
                'description' => 'C# programming language, .NET framework, ASP.NET, Unity development'
            ],
            [
                'name' => 'C++',
                'description' => 'C++ programming language, game development, system programming'
            ],
            [
                'name' => 'TypeScript',
                'description' => 'TypeScript programming language, Angular, full-stack development'
            ],
            [
                'name' => 'Go',
                'description' => 'Go programming language, backend development, microservices'
            ],
            [
                'name' => 'Rust',
                'description' => 'Rust programming language, system programming, web assembly'
            ],
            [
                'name' => 'Swift',
                'description' => 'Swift programming language, iOS and macOS development'
            ],
            [
                'name' => 'Kotlin',
                'description' => 'Kotlin programming language, Android development, backend development'
            ],

            // Web Development
            [
                'name' => 'HTML/CSS',
                'description' => 'HTML5, CSS3, responsive design, accessibility, modern CSS frameworks'
            ],
            [
                'name' => 'React',
                'description' => 'React.js library, hooks, state management, Next.js'
            ],
            [
                'name' => 'Vue.js',
                'description' => 'Vue.js framework, Vuex, Vue Router, Nuxt.js'
            ],
            [
                'name' => 'Angular',
                'description' => 'Angular framework, TypeScript, RxJS, Angular Material'
            ],
            [
                'name' => 'Node.js',
                'description' => 'Node.js runtime, Express.js, backend development, APIs'
            ],
            [
                'name' => 'Laravel',
                'description' => 'Laravel PHP framework, Eloquent, Blade, API development'
            ],
            [
                'name' => 'Django',
                'description' => 'Django Python framework, REST APIs, database models, authentication'
            ],
            [
                'name' => 'Spring Boot',
                'description' => 'Spring Boot Java framework, microservices, REST APIs'
            ],

            // Database Technologies
            [
                'name' => 'MySQL',
                'description' => 'MySQL database management, queries, optimization, administration'
            ],
            [
                'name' => 'PostgreSQL',
                'description' => 'PostgreSQL database, advanced features, performance tuning'
            ],
            [
                'name' => 'MongoDB',
                'description' => 'MongoDB NoSQL database, document storage, aggregation'
            ],
            [
                'name' => 'Redis',
                'description' => 'Redis in-memory data store, caching, sessions, queues'
            ],
            [
                'name' => 'SQLite',
                'description' => 'SQLite database, embedded systems, mobile development'
            ],

            // DevOps & Cloud
            [
                'name' => 'Docker',
                'description' => 'Docker containerization, Docker Compose, container orchestration'
            ],
            [
                'name' => 'Kubernetes',
                'description' => 'Kubernetes container orchestration, deployment, scaling'
            ],
            [
                'name' => 'AWS',
                'description' => 'Amazon Web Services, EC2, S3, Lambda, cloud infrastructure'
            ],
            [
                'name' => 'Azure',
                'description' => 'Microsoft Azure cloud services, virtual machines, app services'
            ],
            [
                'name' => 'Google Cloud',
                'description' => 'Google Cloud Platform, Compute Engine, Cloud Functions'
            ],
            [
                'name' => 'Linux',
                'description' => 'Linux administration, shell scripting, server management'
            ],
            [
                'name' => 'Git',
                'description' => 'Git version control, GitHub, GitLab, collaboration workflows'
            ],

            // Mobile Development
            [
                'name' => 'React Native',
                'description' => 'React Native framework, cross-platform mobile development'
            ],
            [
                'name' => 'Flutter',
                'description' => 'Flutter SDK, Dart language, cross-platform mobile development'
            ],
            [
                'name' => 'iOS Development',
                'description' => 'iOS app development, Swift, UIKit, SwiftUI'
            ],
            [
                'name' => 'Android Development',
                'description' => 'Android app development, Kotlin, Jetpack Compose'
            ],

            // Data Science & AI
            [
                'name' => 'Machine Learning',
                'description' => 'Machine learning algorithms, neural networks, TensorFlow, PyTorch'
            ],
            [
                'name' => 'Data Analysis',
                'description' => 'Data analysis, pandas, NumPy, data visualization'
            ],
            [
                'name' => 'Artificial Intelligence',
                'description' => 'AI concepts, natural language processing, computer vision'
            ],
            [
                'name' => 'Data Visualization',
                'description' => 'Data visualization, Tableau, D3.js, matplotlib, seaborn'
            ],

            // Other Technologies
            [
                'name' => 'REST APIs',
                'description' => 'RESTful API design, development, documentation, testing'
            ],
            [
                'name' => 'GraphQL',
                'description' => 'GraphQL query language, Apollo, schema design'
            ],
            [
                'name' => 'Web Security',
                'description' => 'Web application security, OWASP, authentication, authorization'
            ],
            [
                'name' => 'Testing',
                'description' => 'Software testing, unit tests, integration tests, Jest, PHPUnit'
            ],
            [
                'name' => 'Agile Methodology',
                'description' => 'Agile development, Scrum, Kanban, project management'
            ],
            [
                'name' => 'UI/UX Design',
                'description' => 'User interface design, user experience, Figma, prototyping'
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }

        $this->command->info('Successfully seeded ' . count($subjects) . ' subjects!');
    }
}
