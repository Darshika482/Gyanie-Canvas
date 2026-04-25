const baseSchedule = [
  { id: 'sch1', name: 'Early Riser', name_hi: 'सुबह जल्दी उठना', start_time: '05:45', end_time: '06:15', venue: 'Dormitory', coordinator: 'Suresh Patel', coins: 50, type: 'base', session: 'morning', materials: ['Whistle', 'Attendance sheet'], notes: 'Students must be up by 5:45 AM. Ring bell twice.' },
  { id: 'sch2', name: 'Yoga', name_hi: 'योग', start_time: '06:15', end_time: '07:15', venue: 'Main Ground', coordinator: 'Naresh Singh', coins: 0, type: 'base', session: 'morning', materials: ['Yoga mats', 'Sound system'], notes: 'Digital points only. No physical coins.' },
  { id: 'sch3', name: 'Morning Puja', name_hi: 'सुबह पूजा', start_time: '07:15', end_time: '08:15', venue: 'Temple Hall', coordinator: 'Suresh Patel', coins: 80, type: 'base', session: 'morning', materials: ['Puja thali', 'Flowers', 'Incense'], notes: 'All students must attend with proper attire.' },
  { id: 'sch4', name: 'Breakfast', name_hi: 'नाश्ता', start_time: '08:30', end_time: '09:15', venue: 'Dining Hall', coordinator: 'Kamlesh Joshi', coins: 0, type: 'base', session: 'morning', materials: [], notes: 'Bhojan Discipline points given here.' },
  { id: 'sch5', name: 'Class Session', name_hi: 'कक्षा सत्र', start_time: '09:15', end_time: '12:30', venue: 'Classrooms', coordinator: 'Mahesh Gupta', coins: 150, type: 'base', session: 'morning', materials: ['Notebooks', 'Pens', 'Whiteboard'], notes: 'Class teachers award points for answers.' },
  { id: 'sch6', name: 'Slot 1 Submission', name_hi: 'स्लॉट 1 जमा', start_time: '12:30', end_time: '13:00', venue: 'Collection Desks', coordinator: 'Rakesh Mehta', coins: 0, type: 'slot', session: 'morning', materials: ['Coin bags', 'Register'], notes: 'Morning coins must be submitted by 1 PM.' },
  { id: 'sch7', name: 'Lunch', name_hi: 'दोपहर का भोजन', start_time: '13:00', end_time: '14:00', venue: 'Dining Hall', coordinator: 'Kamlesh Joshi', coins: 0, type: 'base', session: 'afternoon', materials: [], notes: '' },
  { id: 'sch8', name: 'Afternoon Bhakti', name_hi: 'दोपहर भक्ति', start_time: '14:00', end_time: '15:45', venue: 'Satsang Hall', coordinator: 'Ganesh Rao', coins: 100, type: 'base', session: 'afternoon', materials: ['Song books', 'Instruments', 'Sound system'], notes: 'Students get points for active participation.' },
  { id: 'sch9', name: 'Afternoon Class', name_hi: 'दोपहर कक्षा', start_time: '15:45', end_time: '16:30', venue: 'Classrooms', coordinator: 'Prakash Verma', coins: 100, type: 'base', session: 'afternoon', materials: ['Activity sheets', 'Art supplies'], notes: '' },
  { id: 'sch10', name: 'Slot 2 Submission', name_hi: 'स्लॉट 2 जमा', start_time: '16:30', end_time: '17:00', venue: 'Collection Desks', coordinator: 'Rakesh Mehta', coins: 0, type: 'slot', session: 'afternoon', materials: ['Coin bags', 'Register'], notes: 'Afternoon coins must be submitted by 4:30 PM.' },
  { id: 'sch11', name: 'Games', name_hi: 'खेल', start_time: '17:00', end_time: '19:00', venue: 'Sports Ground', coordinator: 'Dinesh Kumar', coins: 80, type: 'base', session: 'evening', materials: ['Sports equipment', 'First aid kit'], notes: 'Various team sports.' },
  { id: 'sch12', name: 'Evening Program', name_hi: 'शाम कार्यक्रम', start_time: '19:00', end_time: '21:00', venue: 'Main Stage', coordinator: 'Ganesh Rao', coins: 80, type: 'base', session: 'evening', materials: ['Stage setup', 'Mics', 'Lights'], notes: 'Cultural programs, skits, and talent show.' },
  { id: 'sch13', name: 'Slot 3 Submission', name_hi: 'स्लॉट 3 जमा', start_time: '21:00', end_time: '22:00', venue: 'Collection Desks', coordinator: 'Rakesh Mehta', coins: 0, type: 'slot', session: 'evening', materials: ['Coin bags', 'Register'], notes: 'Final submission. Unsubmitted coins forfeited.' },
  { id: 'sch14', name: 'Lights Out', name_hi: 'लाइट बंद', start_time: '22:00', end_time: '22:00', venue: 'Dormitory', coordinator: 'All', coins: 0, type: 'base', session: 'night', materials: [], notes: 'All students must be in their rooms.' },
];

export const mockSchedule = {};
for (let day = 1; day <= 6; day++) {
  mockSchedule[day] = baseSchedule.map(item => ({
    ...item,
    id: `${item.id}_d${day}`,
    day,
  }));
}

// Add special activities for some days
mockSchedule[1].push({
  id: 'special1_d1', day: 1, name: 'Opening Ceremony', name_hi: 'उद्घाटन समारोह',
  start_time: '18:00', end_time: '19:00', venue: 'Main Ground',
  coordinator: 'Ramesh Sharma', coins: 50, type: 'special', session: 'evening',
  materials: ['Flags', 'Garlands', 'Sound system', 'Chairs'],
  notes: 'Welcome ceremony for all students and parents.'
});
mockSchedule[3].push({
  id: 'special2_d3', day: 3, name: 'Cultural Night', name_hi: 'सांस्कृतिक रात',
  start_time: '20:00', end_time: '22:00', venue: 'Main Stage',
  coordinator: 'Ganesh Rao', coins: 60, type: 'special', session: 'evening',
  materials: ['Costumes', 'Props', 'Extra mics', 'Decorations'],
  notes: 'Students perform prepared skits and dances.'
});
mockSchedule[6].push({
  id: 'special3_d6', day: 6, name: 'Closing Ceremony & Prize Distribution', name_hi: 'समापन समारोह व पुरस्कार वितरण',
  start_time: '17:00', end_time: '19:00', venue: 'Main Ground',
  coordinator: 'Ramesh Sharma', coins: 0, type: 'special', session: 'evening',
  materials: ['Trophies', 'Certificates', 'Gifts', 'Decorations'],
  notes: 'Final ceremony. Parents invited.'
});
