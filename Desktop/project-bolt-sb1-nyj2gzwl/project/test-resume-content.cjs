const fs = require('fs');

// Create a test HTML that mimics your actual resume structure
const testResumeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Resume - All Content</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
        }
        
        .resume-container {
            display: flex;
            min-height: 100vh;
        }
        
        .left-column {
            background: #2c3e50;
            color: white;
            width: 30%;
            padding: 20px;
        }
        
        .right-column {
            background: white;
            color: black;
            width: 70%;
            padding: 20px;
        }
        
        .contact-section {
            margin-bottom: 30px;
        }
        
        .skills-section {
            margin-bottom: 30px;
        }
        
        .languages-section {
            margin-bottom: 30px;
        }
        
        .experience-section {
            margin-bottom: 30px;
        }
        
        h1, h2, h3 {
            margin: 0 0 10px 0;
        }
        
        .job-item {
            margin-bottom: 20px;
        }
        
        .job-title {
            font-weight: bold;
            color: #3498db;
        }
        
        .company {
            color: #7f8c8d;
        }
        
        .date {
            color: #95a5a6;
            font-size: 14px;
        }
        
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="left-column">
            <div class="contact-section">
                <h2>CONTACT</h2>
                <p>+1-124-161-8172</p>
                <p>anitacooks@gmail.com</p>
                <p>behance.com/__NAME__</p>
                <p>New York, NYC</p>
            </div>
            
            <div class="skills-section">
                <h2>SKILLS</h2>
                <p>UI/UX Design</p>
                <p>Figma</p>
                <p>Adobe Creative Suite</p>
                <p>Prototyping</p>
            </div>
            
            <div class="languages-section">
                <h2>LANGUAGES</h2>
                <p>HTML and CSS - Proficient</p>
                <p>Javascript - Intermediate</p>
                <p>React - Intermediate</p>
            </div>
        </div>
        
        <div class="right-column">
            <h1>darshika</h1>
            <p>Experienced ui with 1+ years in Media</p>
            
            <div class="experience-section">
                <h2>EXPERIENCE</h2>
                
                <div class="job-item">
                    <div class="job-title">UI/UX Designer</div>
                    <div class="company">Gutmann</div>
                    <div class="date">2017 - Present</div>
                    <div class="location">New York, NYC</div>
                    <ul>
                        <li>Created and maintained UI standards for 20+ websites, which included over 100 components</li>
                        <li>Worked cross-functionally with developers to implement new features and redesigns</li>
                        <li>Re-designed the website and decreased the bounce rate by 40%</li>
                        <li>Did some front end programming (HTML 5, CSS, JavaScript) to build actual prototypes</li>
                        <li>Improved load speed on mobile, from 14 to 6 seconds, by applying recommended optimizations</li>
                        <li>App successfully connected a user base of over 150 babysitters and parents</li>
                    </ul>
                </div>
                
                <div class="job-item">
                    <div class="job-title">Junior UX Designer</div>
                    <div class="company">Padberg</div>
                    <div class="date">2007 - 2009</div>
                    <div class="location">New York, NYC</div>
                    <ul>
                        <li>Achieved 85%+ student completion rate on lectures, videos & assignments</li>
                        <li>Established a team of 3 covering every key role on an early stage startup</li>
                        <li>Reached 400% in user retention on Padberg website, by introducing publicity campaigns</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Create the request body
const requestBody = {
    html: testResumeHTML,
    config: {
        format: 'A4',
        dpi: 300,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    }
};

// Make the request to the server
async function testResumeContent() {
    try {
        console.log('Testing complete resume content export...');
        console.log('This test includes:');
        console.log('- Contact information (phone, email, portfolio, location)');
        console.log('- Skills section');
        console.log('- Languages section');
        console.log('- Experience with job titles, companies, dates, and bullet points');

        const response = await fetch('http://localhost:4001/api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            return;
        }

        const pdfBuffer = await response.arrayBuffer();
        fs.writeFileSync('complete-resume-test.pdf', Buffer.from(pdfBuffer));

        console.log(`Complete resume PDF generated successfully!`);
        console.log(`File size: ${pdfBuffer.byteLength} bytes`);
        console.log('Saved as complete-resume-test.pdf');
        console.log('Check the PDF to verify ALL content is exported:');
        console.log('- Contact info: +1-124-161-8172, anitacooks@gmail.com, etc.');
        console.log('- Skills: UI/UX Design, Figma, Adobe Creative Suite, etc.');
        console.log('- Languages: HTML and CSS, Javascript, React');
        console.log('- Experience: UI/UX Designer at Gutmann, Junior UX Designer at Padberg');
        console.log('- All bullet points and job details');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testResumeContent(); 