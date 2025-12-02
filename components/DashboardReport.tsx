
import React from 'react';
import { KPI_DATA } from '../constants';
import { EvaluationState } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import { EmployeeInfo } from '../App';

interface DashboardReportProps {
  ratings: EvaluationState;
  selectedMonth: string;
  totalScore: number;
  maxTotalScore: number;
  percent: number;
  ranking: string;
  categoryScores: any[];
  employeeInfo: EmployeeInfo;
  logoUrl: string | null;
}

const DashboardReport: React.FC<DashboardReportProps> = ({
  ratings,
  selectedMonth,
  totalScore,
  maxTotalScore,
  percent,
  ranking,
  categoryScores,
  employeeInfo,
  logoUrl
}) => {
  const [year, month] = selectedMonth.split('-');
  const reportDateObj = employeeInfo.reportDate ? new Date(employeeInfo.reportDate) : new Date();

  // Updated colors to match App theme: Indigo (Vận hành), Emerald (An toàn), Amber (Thiết bị), Rose (Nhân sự)
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    // Explicitly set 210mm width as max to match print container, but w-full to fill it
    <div className="bg-white text-slate-900 font-sans w-full p-[5mm] relative box-border">
      {/* --- HEADER --- */}
      <div className="flex border-b-2 border-slate-900 pb-3 mb-3 print:pb-2 print:mb-2 items-center">
        <div className="w-1/4 flex flex-col items-center justify-center border-r border-slate-200 pr-4">
           {/* LOGO AREA - Only show if logoUrl exists */}
           {logoUrl ? (
             <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full max-h-16 object-contain"
             />
           ) : (
             <div className="h-16 w-full flex items-center justify-center">
                {/* Empty space if no logo is uploaded */}
             </div>
           )}
        </div>
        <div className="w-3/4 pl-5 flex flex-col justify-center">
           <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wide print:text-xl">Báo Cáo Hiệu Quả Công Việc (KPI)</h1>
           <div className="flex justify-between items-end mt-2">
             <div className="text-slate-600 font-bold text-xs uppercase bg-slate-100 px-2 py-0.5 rounded">Dành cho cấp Quản lý / Vận hành Lò hơi</div>
             <div className="flex gap-4 text-[10px]">
                <div><span className="text-slate-500">Kỳ đánh giá:</span> <span className="font-bold text-slate-900">Tháng {month}/{year}</span></div>
                <div><span className="text-slate-500">Ngày lập:</span> <span className="font-bold text-slate-900">{reportDateObj.toLocaleDateString('vi-VN')}</span></div>
             </div>
           </div>
        </div>
      </div>

      {/* --- EMPLOYEE INFO (Single Row Compact) --- */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 print:p-2 print:mb-2 grid grid-cols-4 gap-4 text-[10px]">
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Họ và tên</span>
            <span className="font-bold uppercase text-blue-900 text-xs">{employeeInfo.name || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Mã nhân viên</span>
            <span className="font-bold text-slate-800">{employeeInfo.id || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Chức vụ</span>
            <span className="font-bold text-slate-800">{employeeInfo.position || '................................'}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Bộ phận</span>
            <span className="font-bold text-slate-800">{employeeInfo.department || '................................'}</span>
         </div>
      </div>

      {/* --- DASHBOARD VISUALS (Adjusted Height to h-40 normally, but h-32 when printing) --- */}
      <div className="grid grid-cols-3 gap-2 mb-3 h-40 print:h-32 print:mb-2">
         {/* KPI SCORE CARD */}
         <div className="col-span-1 bg-white rounded border border-slate-200 p-2 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-1 opacity-5">
               <CheckCircle2 size={60} />
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 print:mb-1">Tổng Điểm</div>
            <div className="text-5xl font-extrabold text-blue-900 leading-none mb-1 print:text-4xl">{Number(totalScore).toFixed(2)}</div>
            <div className="text-slate-400 text-[10px] font-medium mb-3 print:mb-1">/ {maxTotalScore} điểm tối đa</div>
            <div className={`px-4 py-1 rounded-full text-[10px] font-bold border ${
               percent >= 90 ? 'bg-green-100 text-green-800 border-green-200' :
               percent >= 70 ? 'bg-blue-100 text-blue-800 border-blue-200' :
               'bg-red-100 text-red-800 border-red-200'
            }`}>
               XẾP LOẠI: {ranking.toUpperCase()}
            </div>
         </div>

         {/* PIE CHART (Donut Style - Replacing Radar) */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Cơ cấu điểm</div>
            <div className="w-full h-full flex items-center justify-center">
                <PieChart width={200} height={120}>
                <Pie
                    data={categoryScores}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="score"
                    nameKey="shortName"
                    isAnimationActive={false}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight="bold">
                            {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        ) : null;
                    }}
                >
                    {categoryScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', bottom: 0 }} layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
            </div>
         </div>

         {/* BAR CHART (Vertical Columns - Dark Blue Theme) */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Chi tiết theo mục</div>
            <div className="w-full h-full flex items-center justify-center pl-2 pt-2">
                <BarChart width={200} height={120} data={categoryScores} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="shortName" tick={{fontSize: 8, fill: '#0f172a', fontWeight: 600}} interval={0} />
                <YAxis tick={{fontSize: 8, fill: '#64748b'}} domain={[0, 'dataMax']} />
                <Bar dataKey="max" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={10} name="Tối đa" isAnimationActive={false} />
                <Bar dataKey="score" fill="#1e3a8a" radius={[2, 2, 0, 0]} barSize={10} name="Đạt được" isAnimationActive={false} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', paddingTop: '5px' }} />
                </BarChart>
            </div>
         </div>
      </div>

      {/* --- DETAILED TABLE (Condensed with p-1 padding) --- */}
      {/* Adjusted print margin-top to 6 as requested */}
      <div className="mb-3 mt-11 print:mt-6">
         <h3 className="text-[10px] font-bold text-white bg-blue-900 uppercase py-1 px-2 mb-0 rounded-t inline-block">Bảng điểm chi tiết</h3>
         <div className="border-t-2 border-blue-900">
            <table className="w-full text-[9px] border-collapse">
                <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold">
                    <th className="border border-slate-300 p-1 text-center w-6">TT</th>
                    <th className="border border-slate-300 p-1 text-left">Nội dung / Tiêu chí đánh giá</th>
                    <th className="border border-slate-300 p-1 text-center w-8">Max</th>
                    <th className="border border-slate-300 p-1 text-center w-8">Đạt</th>
                    <th className="border border-slate-300 p-1 text-center w-14">Xếp loại</th>
                    <th className="border border-slate-300 p-1 text-left w-[340px]">Ghi chú</th>
                </tr>
                </thead>
                <tbody>
                {KPI_DATA.map(category => (
                    <React.Fragment key={category.id}>
                        <tr className="bg-blue-50/50 font-bold text-blue-900">
                            <td className="border border-slate-300 p-1 text-center">{category.id.split('_')[1]}</td>
                            <td className="border border-slate-300 p-1" colSpan={5}>{category.name}</td>
                        </tr>
                        {category.items.map(item => {
                            const rating = ratings[item.id];
                            return (
                            <tr key={item.id}>
                                <td className="border border-slate-300 p-1 text-center text-slate-500">{item.code}</td>
                                <td className="border border-slate-300 p-1">
                                    <div className="font-semibold text-slate-800">{item.name}</div>
                                    <div className="text-slate-500 italic mt-0.5 text-[8px] leading-tight">
                                        {rating ? item.criteria[rating.level].description : `Mục tiêu: ${item.criteria['GOOD'].description}`}
                                    </div>
                                </td>
                                <td className="border border-slate-300 p-1 text-center text-slate-500">{item.maxPoints}</td>
                                <td className="border border-slate-300 p-1 text-center font-bold text-slate-800">{rating ? rating.actualScore.toFixed(2) : '0.00'}</td>
                                <td className="border border-slate-300 p-1 text-center">
                                    {rating ? (
                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-bold border ${
                                        rating.level === 'GOOD' ? 'bg-green-50 text-green-700 border-green-200' :
                                        rating.level === 'AVERAGE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {rating.level === 'GOOD' ? 'TỐT' : rating.level === 'AVERAGE' ? 'TRUNG BÌNH' : 'YẾU'}
                                        </span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="border border-slate-300 p-1 text-slate-600 whitespace-normal break-words">{rating?.notes}</td>
                            </tr>
                            );
                        })}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* --- SIGNATURES (Bottom Positioned) --- */}
      {/* Adjusted spacing for print to 12 as requested */}
      <div className="grid grid-cols-3 gap-8 mt-auto pt-2 print:mt-12">
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-12 print:mb-20 text-slate-800">Người được đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[9px] font-bold text-slate-900 uppercase">
                {employeeInfo.name || '.....................'}
            </div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-12 print:mb-20 text-slate-800">Người đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-12 print:mb-20 text-slate-800">Giám đốc phê duyệt</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
      </div>
    </div>
  );
};

export default DashboardReport;
