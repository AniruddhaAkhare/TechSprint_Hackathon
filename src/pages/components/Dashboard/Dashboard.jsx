import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import './Dashboard.css';
import Centers from '../Settings/Centers';

const Dashboard = () => {
  const db = getFirestore();

  const [data, setData] = useState({
    Batch: [],
    student: [], // lowercase "s"
    Course: [],
    Instructor: [],
    Centers:[],
  });

  const getStudentStatusCounts = (students) => {
    return students.reduce((counts, student) => {
      const status = student.status || 'enquiry';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  };


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribeBatch = onSnapshot(
      collection(db, 'Batch'),
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Batch: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeStudent = onSnapshot(
      collection(db, 'student'), // lowercase "s"
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          student: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );


    const unsubscribeStudentStatus = onSnapshot(
      collection(db, 'student'), // lowercase "s"
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          student: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeCourse = onSnapshot(
      collection(db, 'Course'),
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Course: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeInstructor = onSnapshot(
      collection(db, 'Instructor'),
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Instructor: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    const unsubscribeCenter = onSnapshot(
      collection(db, 'Centers'),
      
      (snapshot) => {
        setData((prev) => ({
          ...prev,
          Centers: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoading(false);
      },
      (err) => setError(err.message)
    );

    return () => {
      unsubscribeBatch();
      unsubscribeStudentStatus();
      unsubscribeStudent();
      unsubscribeCourse();
      unsubscribeInstructor();
      unsubscribeCenter();
    };
  }, [db]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <div className=" dashboard flex-col w-screen ml-80 pd-4">
      <h1>Dashboard</h1>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Batches</h3>
          <p>Total: {data.Batch.length}</p>
          <ul>
            {data.Batch.map((batch) => (
              <li key={batch.id}>{batch.name || 'Unnamed Batch'}</li>
            ))}
          </ul>
        </div>
        <div className="metric-card">
          <h3>Students</h3>
          <p>Total: {data.student.length}</p>
          <ul>
            {data.student.map((student) => (
              <li key={student.id}>{student.first_name || 'Unnamed Student'}</li>
            ))}
          </ul>
        </div>

        <div className="metric-card">
          <h3>Students</h3>
          {/* <p>Total: {data.student.length}</p> */}
          <div className="status-counts">
            <ul>
              <li><b>Active:</b> {getStudentStatusCounts(data.student).active || 0}</li>
              <li><b>Enrolled:</b> {getStudentStatusCounts(data.student).enrolled || 0}</li>
              <li><b>Enquiry:</b> {getStudentStatusCounts(data.student).enquiry || 0}</li>
              <li><b>Inactive:</b> {getStudentStatusCounts(data.student).inactive || 0}</li>
            </ul>
          </div>
        </div>

        <div className="metric-card">
          <h3>Courses</h3>
          <p>Total: {data.Course.length}</p>
          <ul>
            {data.Course.map((course) => (
              <li key={course.id}>{course.name || 'Unnamed Course'}</li>
            ))}
          </ul>
        </div>
        <div className="metric-card">
          <h3>Instructors</h3>
          <p>Total: {data.Instructor.length}</p>
          <ul>
            {data.Instructor.map((instructor) => (
              <li key={instructor.id}>{instructor.f_name || 'Unnamed Instructor'}</li>
            ))}
          </ul>
        </div>

        <div className="metric-card">
          <h3>Centers</h3>
          <p>Total: {data.Centers.length}</p>

          
          <ul>
            {data.Centers.map((center) => (
              <li key={center.id}>{center.name || 'Unnamed Instructor'}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
