export interface Vip {
  UID: string;
  Full_Name: string;
  Position: string;
  State: string;
  Email: string;
  Phone: string;
  Book_Title: string;
  Received: 'Yes' | 'No';
  Date_Received: string; // YYYY-MM-DD
  Admin_Name: string;
  Rating: number; // 1-5
  Flags: string;
  Created_By: string;
  Created_At: string; // ISO Timestamp
  Notes: string;
}

export const ADMIN_PIN = '1234';
export const SUPER_ADMIN_PIN = '5678';

export const INITIAL_VIP_DATA: Vip[] = [
  {
    UID: 'uid_1',
    Full_Name: 'Ravi Singh',
    Position: 'MP',
    State: 'Maharashtra',
    Email: 'ravi.singh@example.com',
    Phone: '9876543210',
    Book_Title: 'The Grand Challenge',
    Received: 'Yes',
    Date_Received: '2025-10-01',
    Admin_Name: 'admin1',
    Rating: 5,
    Flags: '',
    Created_By: 'admin',
    Created_At: '2023-01-15T10:00:00Z',
    Notes: 'Met during the annual conference.',
  },
  {
    UID: 'uid_2',
    Full_Name: 'Priya Sharma',
    Position: 'Councilor',
    State: 'Karnataka',
    Email: 'priya.sharma@example.com',
    Phone: '9876543211',
    Book_Title: '',
    Received: 'No',
    Date_Received: '',
    Admin_Name: '',
    Rating: 0,
    Flags: '',
    Created_By: 'searcher',
    Created_At: '2023-02-20T11:30:00Z',
    Notes: 'Follow-up required.',
  },
    {
    UID: 'uid_3',
    Full_Name: 'Ajay Kumar',
    Position: 'MLA',
    State: 'Kerala',
    Email: 'ajay.k@example.com',
    Phone: '9876543212',
    Book_Title: 'Economic Futures',
    Received: 'Yes',
    Date_Received: '2025-09-22',
    Admin_Name: 'admin2',
    Rating: 4,
    Flags: '',
    Created_By: 'admin',
    Created_At: '2023-03-10T09:00:00Z',
    Notes: '',
  },
  {
    UID: 'uid_4',
    Full_Name: 'Sunita Reddy',
    Position: 'MP',
    State: 'Andhra Pradesh',
    Email: 'sunita.r@example.com',
    Phone: '9876543213',
    Book_Title: '',
    Received: 'No',
    Date_Received: '',
    Admin_Name: '',
    Rating: 0,
    Flags: '',
    Created_By: 'admin',
    Created_At: '2023-04-05T14:00:00Z',
    Notes: 'Contact person: Mr. Verma.',
  },
  {
    UID: 'uid_5',
    Full_Name: 'Vikram Mehta',
    Position: 'MLA',
    State: 'Gujarat',
    Email: 'vikram.mehta@example.com',
    Phone: '9876543214',
    Book_Title: 'Innovate and Lead',
    Received: 'Yes',
    Date_Received: '2025-10-05',
    Admin_Name: 'admin1',
    Rating: 5,
    Flags: '',
    Created_By: 'admin',
    Created_At: '2023-05-11T16:45:00Z',
    Notes: 'Very interested in chapter 3.',
  },
    {
    UID: 'uid_6',
    Full_Name: 'Ajay K. Sharma',
    Position: 'Councilor',
    State: 'Maharashtra',
    Email: 'ajay.sharma@example.com',
    Phone: '9876543215',
    Book_Title: '',
    Received: 'No',
    Date_Received: '',
    Admin_Name: '',
    Rating: 0,
    Flags: '',
    Created_By: 'searcher',
    Created_At: '2023-06-18T12:00:00Z',
    Notes: '',
  },
];