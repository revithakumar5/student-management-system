import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';

export default function Reports() {
  const [data, setData] = useState<any>({
    attendanceByCourse: [],
    feesStatus: [],
    studentsByDept: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const [students, attendance, fees, courses] = await Promise.all([
        api.getStudents(),
        api.getAttendance(),
        api.getFees(),
        api.getCourses()
      ]);

      // Attendance by Course
      const attByCourse = courses.map((c: any) => {
        const courseAtt = attendance.filter((a: any) => a.course_id === c.id);
        const present = courseAtt.filter((a: any) => a.status === 'Present').length;
        const rate = courseAtt.length > 0 ? Math.round((present / courseAtt.length) * 100) : 0;
        return { name: c.name, rate };
      });

      // Fees Status
      const paid = fees.filter((f: any) => f.status === 'Paid').length;
      const pending = fees.filter((f: any) => f.status === 'Pending').length;

      // Students by Dept
      const depts: any = {};
      students.forEach((s: any) => {
        depts[s.department] = (depts[s.department] || 0) + 1;
      });
      const studentsByDept = Object.keys(depts).map(name => ({ name, value: depts[name] }));

      setData({
        attendanceByCourse: attByCourse,
        feesStatus: [
          { name: 'Paid', value: paid },
          { name: 'Pending', value: pending }
        ],
        studentsByDept
      });
    };

    fetchData();
  }, []);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Attendance Rate by Course (%)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.attendanceByCourse} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }} 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {data.attendanceByCourse.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Fee Payment Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.feesStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.feesStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Students by Department</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.studentsByDept} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                width={120} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.studentsByDept.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
