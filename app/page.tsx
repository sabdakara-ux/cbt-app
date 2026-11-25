"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

// ==========================================
// 0. SUPABASE CLIENT INITIALIZATION
// ==========================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ==========================================
// 1. ICONS (INLINE SVG)
// ==========================================
const IconBase = ({ children, size = 24, className = '', ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
);
const Clock = (p: any) => <IconBase {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>;
const Calendar = (p: any) => <IconBase {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconBase>;
const Save = (p: any) => <IconBase {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></IconBase>;
const XCircle = (p: any) => <IconBase {...p}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></IconBase>;
const LayoutGrid = (p: any) => <IconBase {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></IconBase>;
const LogOut = (p: any) => <IconBase {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></IconBase>;
const FileText = (p: any) => <IconBase {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></IconBase>;
const Users = (p: any) => <IconBase {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>;
const PlusCircle = (p: any) => <IconBase {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></IconBase>;
const Edit = (p: any) => <IconBase {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></IconBase>;
const Trash2 = (p: any) => <IconBase {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconBase>;
const UserIcon = (p: any) => <IconBase {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconBase>;
const LockIcon = (p: any) => <IconBase {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></IconBase>;
const ShieldCheck = (p: any) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></IconBase>;
const Activity = (p: any) => <IconBase {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></IconBase>;
const Download = (p: any) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></IconBase>;
const RefreshCw = (p: any) => <IconBase {...p}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></IconBase>;
const Briefcase = (p: any) => <IconBase {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></IconBase>;
const BookOpen = (p: any) => <IconBase {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></IconBase>;
const ArrowLeft = (p: any) => <IconBase {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></IconBase>;
const ChevronRight = (p: any) => <IconBase {...p}><polyline points="9 18 15 12 9 6" /></IconBase>;
const MenuIcon = (p: any) => <IconBase {...p}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></IconBase>;
const CheckSquare = (p: any) => <IconBase {...p}><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></IconBase>;

// ==========================================
// 2. DATA TYPES & HELPERS
// ==========================================
interface ClassItem {
  id: string;
  name: string;
}

interface StudentItem {
  nis: string;
  name: string;
  classId: string;
  className: string;
}

interface SubjectItem {
  id: string;
  class_id?: string | null;
  code: string;
  name: string;
  grade_level?: string;
}

interface TeacherItem {
  id: string;
  username: string;
  password: string;
  name: string;
  subjectIds: string[];
}

interface ExamItem {
  id: string;
  subjectId: string;
  title: string;
  duration_minutes: number;
  token: string;
  is_active: boolean;
  date: string;
  start_time: string;
  end_time: string;
}

interface QuestionItem {
  id: string;
  examId?: string | null;
  subjectId: string;
  question_type: 'multiple_choice' | 'essay';
  question_text: string;
  payload: any;
  answer_key: any;
  weight: number;
  order_num: number;
}

interface ExamSessionItem {
  id: string;
  examId: string;
  nis: string;
  name: string;
  className: string;
  status: string;
  score: number;
  violations: number;
  answers: Record<string, any>;
}

interface ClassRecapRow {
  no: number;
  nis: string;
  name: string;
  className: string;
  scoresBySubject: Record<string, number | null>;
  total: number | string;
  average: string;
}

interface AdminDashboardProps {
  currentUser: any;
  teachers: TeacherItem[];
  setTeachers: React.Dispatch<React.SetStateAction<TeacherItem[]>>;
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  students: StudentItem[];
  setStudents: React.Dispatch<React.SetStateAction<StudentItem[]>>;
  subjects: SubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectItem[]>>;
  exams: ExamItem[];
  setExams: React.Dispatch<React.SetStateAction<ExamItem[]>>;
  questions: QuestionItem[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  examSessions: ExamSessionItem[];
  setExamSessions: React.Dispatch<React.SetStateAction<ExamSessionItem[]>>;
  onRefresh: () => Promise<void> | void;
  onBack: () => void;
}

const seededRandom = (seed: number) => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const shuffleArraySeeded = (array: any[], seedString: string) => {
  const seed = seedString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  let currentSeed = seed;
  while (currentIndex !== 0) {
    const random = seededRandom(currentSeed++);
    randomIndex = Math.floor(random * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

// ==========================================
// 3. MAIN APP COMPONENT (SUPABASE CONNECTED)
// ==========================================
const AUTH_STORAGE_KEY = 'cbt_persisted_auth_v1';

export default function CBTApp() {
  const [view, setView] = useState<'login' | 'exam' | 'admin'>('login');
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const persistAuth = useCallback((nextView: 'login' | 'exam' | 'admin', nextUser: any, nextSession: any) => {
    if (nextView === 'login') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          view: nextView,
          currentUser: nextUser,
          session: nextSession
        })
      );
    }
  }, []);

  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved.view === 'admin' && saved.currentUser) {
          setCurrentUser(saved.currentUser);
          setView('admin');
        } else if (saved.view === 'exam' && saved.session) {
          setSession(saved.session);
          setView('exam');
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [examSessions, setExamSessions] = useState<ExamSessionItem[]>([]);

  const fetchAllData = useCallback(async () => {
    if (!supabase) {
      setDbError('Konfigurasi Supabase belum ditemukan. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi di .env.local.');
      setIsInitializing(false);
      return;
    }

    try {
      const [
        classesRes,
        subjectsRes,
        studentsRes,
        teachersRes,
        examsRes,
        questionsRes,
        sessionsRes
      ] = await Promise.all([
        supabase.from('classes').select('*').order('name'),
        supabase.from('subjects').select('*').order('name'),
        supabase.from('students').select('*, classes(name)').order('name'),
        supabase.from('teachers').select('*').order('name'),
        supabase.from('exams').select('*').order('created_at', { ascending: false }),
        supabase.from('questions').select('*').order('order_num'),
        supabase.from('exam_sessions').select('*').order('updated_at', { ascending: false })
      ]);

      if (classesRes.error) throw classesRes.error;
      if (subjectsRes.error) throw subjectsRes.error;

      setClasses(classesRes.data || []);

      setSubjects(
        (subjectsRes.data || []).map((s: any) => ({
          id: s.id,
          class_id: s.class_id,
          code: s.code,
          name: s.name,
          grade_level: s.grade_level
        }))
      );

      setStudents(
        (studentsRes.data || []).map((s: any) => ({
          nis: s.nis,
          name: s.name,
          classId: s.class_id || '',
          className: s.classes?.name || 'Umum'
        }))
      );

      setTeachers(
        (teachersRes.data || []).map((t: any) => ({
          id: t.id,
          username: t.username,
          password: t.password,
          name: t.name,
          subjectIds: t.subject_ids || []
        }))
      );

      setExams(
        (examsRes.data || []).map((e: any) => ({
          id: e.id,
          subjectId: e.subject_id,
          title: e.title,
          duration_minutes: e.duration_minutes,
          token: e.token,
          is_active: e.is_active,
          date: e.exam_date || '',
          start_time: e.start_time || '',
          end_time: e.end_time || ''
        }))
      );

      setQuestions(
        (questionsRes.data || []).map((q: any) => ({
          id: q.id,
          examId: q.exam_id,
          subjectId: q.subject_id,
          question_type: q.question_type,
          question_text: q.question_text,
          payload: q.payload || {},
          answer_key: q.answer_key || {},
          weight: Number(q.weight || 1),
          order_num: q.order_num || 1
        }))
      );

      setExamSessions(
        (sessionsRes.data || []).map((s: any) => ({
          id: s.id,
          examId: s.exam_id,
          nis: s.nis,
          name: s.name,
          className: s.class_name || 'Umum',
          status: s.status,
          score: Number(s.score || 0),
          violations: s.violations || 0,
          answers: s.answers || {}
        }))
      );

      setDbError(null);
    } catch (err: any) {
      setDbError(`Gagal terhubung ke Supabase: ${err.message}`);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('realtime-exam-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_sessions' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const s: any = payload.new;
            setExamSessions((prev) => {
              if (prev.some((item) => item.id === s.id)) return prev;
              return [
                {
                  id: s.id,
                  examId: s.exam_id,
                  nis: s.nis,
                  name: s.name,
                  className: s.class_name || 'Umum',
                  status: s.status,
                  score: Number(s.score || 0),
                  violations: s.violations || 0,
                  answers: s.answers || {}
                },
                ...prev
              ];
            });
          } else if (payload.eventType === 'UPDATE') {
            const s: any = payload.new;
            setExamSessions((prev) =>
              prev.map((item) =>
                item.id === s.id ? { ...item, status: s.status, score: Number(s.score || 0), violations: s.violations || 0, answers: s.answers || {} } : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRow: any = payload.old;
            setExamSessions((prev) => prev.filter((item) => item.id !== oldRow.id));
          }
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-700 text-lg">Menghubungkan ke Server Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {dbError && (
        <div className="bg-red-600 text-white px-4 py-3 text-sm font-bold text-center shadow-md">
          {dbError}
        </div>
      )}

      {view === 'login' && (
        <LoginView
          exams={exams}
          subjects={subjects}
          students={students}
          teachers={teachers}
          onStudentLogin={(sess: any) => { setSession(sess); setView('exam'); persistAuth('exam', null, sess); }}
          onAdminLogin={() => { const adminUser = { role: 'admin' }; setCurrentUser(adminUser); fetchAllData(); setView('admin'); persistAuth('admin', adminUser, null); }}
          onTeacherLogin={(teacher: any) => { const teacherUser = { role: 'teacher', ...teacher }; setCurrentUser(teacherUser); fetchAllData(); setView('admin'); persistAuth('admin', teacherUser, null); }}
        />
      )}

      {view === 'exam' && (
        <ExamView
          session={session}
          onFinish={() => { setSession(null); fetchAllData(); setView('login'); persistAuth('login', null, null); }}
        />
      )}

      {view === 'admin' && (
        <AdminDashboard
          currentUser={currentUser}
          teachers={teachers}
          setTeachers={setTeachers}
          classes={classes}
          setClasses={setClasses}
          students={students}
          setStudents={setStudents}
          subjects={subjects}
          setSubjects={setSubjects}
          exams={exams}
          setExams={setExams}
          questions={questions}
          setQuestions={setQuestions}
          examSessions={examSessions}
          setExamSessions={setExamSessions}
          onRefresh={fetchAllData}
          onBack={() => { setCurrentUser(null); setView('login'); persistAuth('login', null, null); }}
        />
      )}
    </div>
  );
}

// ==========================================
// 4. LOGIN VIEW (STUDENT / TEACHER / ADMIN)
// ==========================================
function LoginView({ exams, subjects, students, teachers, onStudentLogin, onAdminLogin, onTeacherLogin }: any) {
  const [loginType, setLoginType] = useState<'student' | 'teacher' | 'admin'>('student');
  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin') {
        if (username === 'admin' && password === 'admin') onAdminLogin();
        else setError('Username atau password admin salah!');
      } else if (loginType === 'teacher') {
        const teacher = teachers.find((t: any) => t.username === username && t.password === password);
        if (teacher) onTeacherLogin(teacher);
        else setError('Username atau password guru salah!');
      } else {
        if (!supabase) { setError('Koneksi database Supabase belum siap.'); setLoading(false); return; }

        const { data: examData, error: examErr } = await supabase
          .from('exams')
          .select('*')
          .eq('token', token.toUpperCase())
          .eq('is_active', true)
          .maybeSingle();

        if (examErr || !examData) { setError('Token ujian tidak valid atau ujian belum aktif!'); setLoading(false); return; }

        if (!nis.trim() || !name.trim()) { setError('NIS dan Nama wajib diisi!'); setLoading(false); return; }

        // --- VALIDASI TANGGAL & JAM UJIAN ---
        if (examData.exam_date || examData.start_time || examData.end_time) {
          const now = new Date();
          const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
            now.getDate()
          ).padStart(2, '0')}`;
          const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
            2,
            '0'
          )}`;

          const startStr = examData.start_time ? examData.start_time.substring(0, 5) : '00:00';
          const endStr = examData.end_time ? examData.end_time.substring(0, 5) : '23:59';
          const formattedDate = examData.exam_date
            ? new Date(examData.exam_date + 'T00:00:00').toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : 'Hari ini';

          if (examData.date && currentDateStr < examData.exam_date) {
            setError(`Ujian belum dimulai! Jadwal ujian pada ${formattedDate}, pukul ${startStr} - ${endStr}.`);
            setLoading(false);
            return;
          }
          if (examData.exam_date && currentDateStr < examData.exam_date) {
            setError(`Ujian belum dimulai! Jadwal ujian pada ${formattedDate}, pukul ${startStr} - ${endStr}.`);
            setLoading(false);
            return;
          }
          if (examData.exam_date && currentDateStr > examData.exam_date) {
            setError(`Tanggal ujian telah berakhir! Jadwal ujian pada ${formattedDate}, pukul ${startStr} - ${endStr}.`);
            setLoading(false);
            return;
          }
          if (examData.start_time && currentTimeStr < startStr) {
            setError(`Sesi ujian belum dibuka! Silakan masuk pada pukul ${startStr} - ${endStr} (${formattedDate}).`);
            setLoading(false);
            return;
          }
          if (examData.end_time && currentTimeStr > endStr) {
            setError(`Waktu jadwal ujian telah berakhir! Batas pengerjaan sampai pukul ${endStr} (${formattedDate}).`);
            setLoading(false);
            return;
          }
        }

        const { data: existingSession } = await supabase.from('exam_sessions').select('*').eq('exam_id', examData.id).eq('nis', nis.trim()).maybeSingle();

        if (existingSession && (existingSession.status === 'completed' || existingSession.status === 'locked')) {
          setError('Anda sudah menyelesaikan atau terkunci dari ujian ini! Silakan hubungi Guru/Admin.');
          setLoading(false);
          return;
        }

        const subject = subjects.find((s: any) => s.id === examData.subject_id);
        const studentData = students.find((s: any) => s.nis === nis.trim());
        const resolvedClassName = studentData ? studentData.className : 'Umum';

        let activeSessionId = existingSession?.id;
        let savedAnswers = existingSession?.answers || {};
        let savedViolations = existingSession?.violations || 0;
        let startedAtMs = existingSession?.started_at ? new Date(existingSession.started_at).getTime() : Date.now();

        if (!existingSession) {
          const { data: newSession, error: insertErr } = await supabase
            .from('exam_sessions')
            .insert({
              exam_id: examData.id,
              nis: nis.trim(),
              name: name.trim(),
              class_name: resolvedClassName,
              status: 'in_progress',
              answers: {}
            })
            .select()
            .single();

          if (insertErr || !newSession) { setError(`Gagal memulai sesi ujian: ${insertErr?.message || 'Error tidak diketahui'}`); setLoading(false); return; }
          activeSessionId = newSession.id;
          startedAtMs = newSession.started_at ? new Date(newSession.started_at).getTime() : Date.now();
        }

        let endTime = startedAtMs + examData.duration_minutes * 60 * 1000;
        if (examData.exam_date && examData.end_time) {
          const [y, m, d] = examData.exam_date.split('-').map(Number);
          const [endH, endM] = examData.end_time.split(':').map(Number);
          const scheduledEndMs = new Date(y, m - 1, d, endH, endM, 59).getTime();
          endTime = Math.min(endTime, scheduledEndMs);
        }

        onStudentLogin({
          sessionId: activeSessionId,
          examId: examData.id,
          subjectId: examData.subject_id,
          nis: nis.trim(),
          name: name.trim(),
          className: resolvedClassName,
          examTitle: examData.title,
          subjectName: subject?.name || 'Mata Pelajaran',
          duration: examData.duration_minutes,
          endTime,
          initialAnswers: savedAnswers,
          initialViolations: savedViolations
        });
      }
    } catch (err: any) { setError(err.message || 'Terjadi kesalahan saat masuk.'); } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Logo Watermark Halaman Login (letakkan file logo.png di folder public/) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <img
          src="/logo.png"
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="w-[420px] h-[420px] md:w-[560px] md:h-[560px] object-contain opacity-[0.08]"
        />
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 flex-col justify-between relative overflow-hidden text-white">
            {/* Background Logo Watermark Panel Kiri */}
            <img
              src="/logo.png"
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="absolute inset-0 m-auto w-80 h-80 object-contain opacity-10 pointer-events-none select-none"
            />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-white/30">
                <ShieldCheck size={36} className="text-white" />
              </div>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">Sistem Ujian<br />SMKS ISLAM NURUL JADID</h1>
              <p className="text-indigo-100 text-lg">Masukan Nomer Peserta, Nama dan Token.</p>
            </div>
            <div className="relative z-10 bg-white/10 p-4 rounded-xl border border-white/20 mt-8 backdrop-blur-sm">
              <p className="text-sm font-bold mb-1 text-white">Tata Tertib Peserta Ujian:</p>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Gunakan token resmi dari pengawas ruangan. Dilarang berpindah tab atau membuka aplikasi lain selama ujian berlangsung.
              </p>
            </div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-white/5 rounded-full"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 border-[20px] border-white/5 rounded-full"></div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-extrabold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500 font-medium">Silakan masuk ke akun Anda</p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
              <button onClick={() => setLoginType('student')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Siswa</button>
              <button onClick={() => setLoginType('teacher')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === 'teacher' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Guru</button>
              <button onClick={() => setLoginType('admin')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Admin</button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100 flex items-start">
                <XCircle className="shrink-0 mr-2" size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {loginType === 'student' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">NIS / No Peserta</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><UserIcon size={18} className="text-slate-400" /></div>
                      <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium" value={nis} onChange={e => setNis(e.target.value)} placeholder="Masukkan NIS" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Siswa" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Token Ujian</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><LockIcon size={18} className="text-slate-400" /></div>
                      <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono font-bold tracking-widest text-lg uppercase" maxLength={6} value={token} onChange={e => setToken(e.target.value.toUpperCase())} placeholder="XXXXXX" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Username {loginType === 'admin' ? 'Admin' : 'Guru'}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><UserIcon size={18} className="text-slate-400" /></div>
                      <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium" value={username} onChange={e => setUsername(e.target.value)} placeholder={loginType === 'admin' ? "Username admin" : "Username guru"} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><LockIcon size={18} className="text-slate-400" /></div>
                      <input required type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none mt-4">
                {loading ? 'Memproses...' : (loginType === 'student' ? 'Mulai Ujian' : 'Masuk Dashboard')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. EXAM VIEW & ANTI-CHEAT (SUPABASE SYNC)
// ==========================================
function ExamView({ session, onFinish }: any) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>(session.initialAnswers || {});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (session.endTime) return Math.max(0, Math.floor((session.endTime - Date.now()) / 1000));
    return session.duration * 60;
  });
  const [syncStatus, setSyncStatus] = useState<'Tersimpan' | 'Menyimpan...' | 'Offline'>('Tersimpan');
  const [violations, setViolations] = useState(session.initialViolations || 0);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState(false);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; onClose?: () => void } | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!supabase) return;
      const { data: latestSession, error: sessErr } = await supabase.from('exam_sessions').select('*').eq('id', session.sessionId).maybeSingle();

      if (sessErr || !latestSession || latestSession.status === 'completed' || latestSession.status === 'locked') {
        localStorage.removeItem(`cbt_ans_${session.sessionId}`);
        onFinish();
        return;
      }

      setViolations(latestSession.violations || 0);
      const { data, error } = await supabase.from('student_questions').select('*').eq('subject_id', session.subjectId).order('order_num');

      if (!error && data) setQuestions(shuffleArraySeeded(data, session.nis));

      const localAns = localStorage.getItem(`cbt_ans_${session.sessionId}`);
      const dbAns = latestSession.answers || {};
      if (localAns) setAnswers({ ...dbAns, ...JSON.parse(localAns) });
      else setAnswers(dbAns);
      setLoading(false);
    };
    loadQuestions();
  }, [session, onFinish]);

  const syncToSupabase = useCallback(
    async (currentAnswers: Record<string, any>, currentViolations: number, statusOverride?: string) => {
      if (!supabase) return;
      setSyncStatus('Menyimpan...');
      const payload: any = { answers: currentAnswers, violations: currentViolations };
      if (statusOverride) payload.status = statusOverride;

      const { error } = await supabase.from('exam_sessions').update(payload).eq('id', session.sessionId);
      setSyncStatus(error ? 'Offline' : 'Tersimpan');
    },
    [session.sessionId]
  );

  const submitExam = useCallback(
    async (silent = false) => {
      setIsLocked(true);
      setSyncStatus('Menyimpan...');
      localStorage.removeItem(`cbt_ans_${session.sessionId}`);

      let score = 0;
      if (supabase) {
        const { data: qWithKeys } = await supabase.from('questions').select('id, question_type, answer_key').eq('subject_id', session.subjectId);
        if (qWithKeys) {
          const pgQuestions = qWithKeys.filter((q: any) => q.question_type === 'multiple_choice');
          if (pgQuestions.length > 0) {
            let correct = 0;
            pgQuestions.forEach((q: any) => { if (answers[q.id] === q.answer_key?.correct) correct++; });
            score = Math.round((correct / pgQuestions.length) * 100);
          }
        }
        await supabase.from('exam_sessions').update({ answers, status: silent ? 'locked' : 'completed', score }).eq('id', session.sessionId);
      }

      if (!silent) {
        setAlertModal({ title: 'Berhasil', message: 'Ujian Selesai. Seluruh jawaban Anda telah berhasil disinkronisasi ke server.', onClose: () => onFinish() });
      } else onFinish();
    },
    [answers, onFinish, session.sessionId, session.subjectId]
  );

  useEffect(() => {
    const handleViolation = () => {
      if (isLocked) return;
      setViolations((prev: number) => {
        const newV = prev + 1;
        if (newV >= 3) {
          setIsLocked(true);
          syncToSupabase(answers, newV, 'locked');
          setAlertModal({ title: 'Ujian Terkunci', message: 'Ujian Anda dikunci karena terlalu banyak pelanggaran (pindah tab). Ujian diselesaikan.', onClose: () => submitExam(true) });
        } else {
          syncToSupabase(answers, newV);
          setAlertModal({ title: 'PELANGGARAN TERDETEKSI!', message: `Dilarang berpindah tab/aplikasi! Ini peringatan ke ${newV} dari 3.` });
        }
        return newV;
      });
    };

    const handleVisibilityChange = () => { if (document.hidden) handleViolation(); };
    const handleBlur = () => { handleViolation(); };
    const preventCopy = (e: any) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('copy', preventCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', preventCopy);
      document.removeEventListener('copy', preventCopy);
    };
  }, [isLocked, answers, syncToSupabase, submitExam]);

  useEffect(() => {
    if (timeLeft <= 0) { submitExam(); return; }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, submitExam]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isLocked) { localStorage.setItem(`cbt_ans_${session.sessionId}`, JSON.stringify(answers)); syncToSupabase(answers, violations); }
    }, 20000);
    return () => clearInterval(intervalId);
  }, [answers, violations, isLocked, session.sessionId, syncToSupabase]);

  const handleAnswerChange = (qId: string, value: any) => {
    if (isLocked) return;
    setAnswers((prev) => {
      const next = { ...prev, [qId]: value };
      localStorage.setItem(`cbt_ans_${session.sessionId}`, JSON.stringify(next));
      setSyncStatus('Offline');
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Menyiapkan Soal dari Server...</div>;
  if (questions.length === 0) {
    return (
      <div className="p-10 text-center max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-md">
        <p className="text-red-500 font-bold mb-4">Belum ada soal untuk mata pelajaran ini.</p>
        <button onClick={onFinish} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Kembali ke Login</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-screen select-none bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="font-extrabold text-lg text-slate-800">{session.examTitle}</h1>
          <p className="text-sm text-slate-500 font-medium">{session.subjectName} • {session.name} ({session.nis})</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 font-mono font-bold text-lg shadow-inner">
            <Clock size={20} className="mr-2" /> {formatTime(timeLeft)}
          </div>
          <button onClick={() => syncToSupabase(answers, violations)} title="Klik untuk sinkronisasi manual" className={`hidden md:flex text-xs px-3 py-1.5 rounded-full items-center font-bold cursor-pointer ${syncStatus === 'Tersimpan' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Save size={14} className="mr-1.5" /> {syncStatus}
          </button>
          <div className={`hidden sm:flex text-xs px-3 py-1.5 rounded-full border font-bold ${violations > 0 ? 'border-red-400 text-red-600 bg-red-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
            Pelanggaran: {violations}/3
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden flex-col md:flex-row">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLocked ? (
            <div className="bg-white p-8 rounded-3xl border border-red-100 text-center text-red-600 max-w-lg mx-auto shadow-xl mt-10">
              <XCircle className="mx-auto mb-4 text-red-500" size={56} />
              <h2 className="text-2xl font-extrabold mb-2">Ujian Terkunci</h2>
              <p className="font-medium text-slate-600">Akses ditutup. Batas pelanggaran tercapai atau ujian telah selesai disubmit.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-md p-6 md:p-10 max-w-4xl mx-auto border border-slate-200/60">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
                <span className="font-extrabold text-lg bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-xl">Soal No. {currentIndex + 1}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">{currentQ.question_type.replace('_', ' ')}</span>
              </div>

              <div className="prose max-w-none mb-8">
                <div
                  className="whitespace-pre-wrap text-xl font-medium leading-relaxed text-slate-800"
                  dangerouslySetInnerHTML={{ __html: currentQ.question_text }}
                />
              </div>

              <div className="mt-4">
                {currentQ.question_type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {(currentQ.payload?.options || []).map((opt: string, i: number) => (
                      <label key={i} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>
                        <input type="radio" name={`q_${currentQ.id}`} value={opt} checked={answers[currentQ.id] === opt} onChange={() => handleAnswerChange(currentQ.id, opt)} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-4 text-slate-700 font-medium text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {currentQ.question_type === 'essay' && (
                  <div>
                    <textarea placeholder="Tuliskan uraian jawaban Anda..." rows={8} autoComplete="off" spellCheck="false" className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 text-lg font-medium outline-none transition shadow-sm resize-y" value={answers[currentQ.id] || ''} onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)} />
                  </div>
                )}
              </div>

              <div className="mt-12 flex justify-between pt-6 border-t border-slate-100">
                <button onClick={() => { syncToSupabase(answers, violations); setCurrentIndex(Math.max(0, currentIndex - 1)); }} disabled={currentIndex === 0} className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition disabled:opacity-40">Sebelumnya</button>
                {currentIndex === questions.length - 1 ? (
                  <button onClick={() => setConfirmModal(true)} className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition">Selesai Ujian</button>
                ) : (
                  <button onClick={() => { syncToSupabase(answers, violations); setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1)); }} className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition">Selanjutnya</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-80 bg-white border-t md:border-l border-slate-200 p-6 flex flex-col shrink-0 h-64 md:h-auto shadow-sm z-10">
          <div className="font-extrabold text-slate-800 mb-5 flex items-center text-lg"><LayoutGrid size={20} className="mr-2 text-indigo-600" /> Navigasi Soal</div>
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-5 md:grid-cols-4 gap-3">
              {questions.map((q, i) => {
                const isAns = !!answers[q.id] && answers[q.id] !== '';
                const isAct = i === currentIndex;
                return (
                  <button key={q.id} onClick={() => setCurrentIndex(i)} className={`h-12 rounded-xl font-bold text-base transition-all border-2 ${isAct ? 'ring-4 ring-indigo-100 border-indigo-500 scale-110 z-10' : ''} ${isAns ? 'bg-indigo-600 text-white border-indigo-600' : !isAct ? 'bg-white text-slate-500 border-slate-200 hover:border-slate-300' : 'bg-white text-slate-800 border-indigo-500'}`}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Modal title="Konfirmasi Selesai Ujian" isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
        <p className="mb-6 text-slate-700 font-medium leading-relaxed">Apakah Anda yakin ingin mengakhiri ujian sekarang? Anda tidak akan bisa mengubah jawaban lagi setelah ini.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition">Batal</button>
          <button onClick={() => { setConfirmModal(false); submitExam(); }} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md transition">Ya, Akhiri Ujian</button>
        </div>
      </Modal>

      <Modal title={alertModal?.title || 'Informasi'} isOpen={!!alertModal} onClose={() => { const cb = alertModal?.onClose; setAlertModal(null); if (cb) cb(); }}>
        <p className="mb-6 text-slate-700 font-medium leading-relaxed">{alertModal?.message}</p>
        <div className="flex justify-end"><button onClick={() => { const cb = alertModal?.onClose; setAlertModal(null); if (cb) cb(); }} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">Tutup</button></div>
      </Modal>
    </div>
  );
}

// ==========================================
// 6. REUSABLE MODAL COMPONENT
// ==========================================
function Modal({ title, isOpen, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h3 className="font-extrabold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><XCircle size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ==========================================
// 7. ADMIN & TEACHER DASHBOARD (SUPABASE CRUD)
// ==========================================
function AdminDashboard({ currentUser, teachers, setTeachers, classes, setClasses, students, setStudents, subjects, setSubjects, exams, setExams, questions, setQuestions, examSessions, setExamSessions, onRefresh, onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'exams' | 'questions' | 'students' | 'classes' | 'teachers' | 'monitoring' | 'koreksi' | 'rekap'>(() => {
    if (typeof window !== 'undefined') { const savedTab = localStorage.getItem('cbt_admin_tab_v1') as any; if (savedTab) return savedTab; }
    return 'monitoring';
  });
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'teacher' && ['teachers', 'classes', 'students'].includes(activeTab)) { setActiveTab('monitoring'); return; }
    localStorage.setItem('cbt_admin_tab_v1', activeTab);
  }, [activeTab, currentUser?.role]);

  const [isTeacherModalOpen, setTeacherModalOpen] = useState(false);
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);

  const [classForm, setClassForm] = useState({ id: '', name: '' });
  const [studentForm, setStudentForm] = useState({ oldNis: '', nis: '', name: '', classId: '' });
  const [subjectForm, setSubjectForm] = useState({ id: '', code: '', name: '', grade: '', class_id: '' });
  const [teacherForm, setTeacherForm] = useState({ id: '', username: '', password: '', name: '', subjectIds: [] as string[] });
  const [examForm, setExamForm] = useState({ id: '', title: '', subjectId: '', token: '', duration: 90, date: '', start_time: '', end_time: '' });
  const [questionForm, setQuestionForm] = useState({ id: '', question_type: 'multiple_choice' as 'multiple_choice' | 'essay', question_text: '', options: ['', '', '', '', ''], correct: '' });

  const visibleSubjects = currentUser.role === 'teacher' ? subjects.filter((s: any) => currentUser.subjectIds.includes(s.id)) : subjects;
  const visibleSubjectIds = visibleSubjects.map((s: any) => s.id);
  const visibleExams = currentUser.role === 'teacher' ? exams.filter((e: any) => visibleSubjectIds.includes(e.subjectId)) : exams;
  const visibleExamIds = visibleExams.map((e: any) => e.id);

  // ==========================================
  // BANK SOAL & REKAP: STATE TAB KELAS & KARTU MAPEL
  // ==========================================
  const [selectedBankClassId, setSelectedBankClassId] = useState<string>(() => (classes.length > 0 ? classes[0].id : 'UMUM'));
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [selectedRekapClassId, setSelectedRekapClassId] = useState<string>(() => (classes.length > 0 ? classes[0].id : 'ALL'));
  const [selectedKoreksiExamId, setSelectedKoreksiExamId] = useState<string>(() => (visibleExams.length > 0 ? visibleExams[0].id : ''));
  const [selectedKoreksiClassFilter, setSelectedKoreksiClassFilter] = useState<string>('ALL');
  const [selectedKoreksiStatusFilter, setSelectedKoreksiStatusFilter] = useState<'ALL' | 'GRADED' | 'UNGRADED'>('ALL');
  const [gradingSession, setGradingSession] = useState<ExamSessionItem | null>(null);
  const [essayScoreInputs, setEssayScoreInputs] = useState<Record<string, string>>({});

  // Sinkronkan Tab Kelas & Rekap Kelas secara otomatis dengan Menu Data Kelas
  useEffect(() => {
    if (classes.length > 0) {
      const isValidClass = classes.some((c: any) => c.id === selectedBankClassId);
      const hasUncategorized = visibleSubjects.some((s: any) => !s.class_id);
      if (!isValidClass && !(selectedBankClassId === 'UMUM' && hasUncategorized)) {
        setSelectedBankClassId(classes[0].id);
        setSelectedSubjectId(null);
      }
      if (selectedRekapClassId !== 'ALL' && !classes.some((c: any) => c.id === selectedRekapClassId)) {
        setSelectedRekapClassId(classes[0].id);
      }
    } else {
      setSelectedBankClassId('UMUM');
      setSelectedRekapClassId('ALL');
    }
  }, [classes, selectedBankClassId, selectedRekapClassId, visibleSubjects]);

  useEffect(() => {
    if (visibleExams.length > 0 && !visibleExams.some((ex: any) => ex.id === selectedKoreksiExamId)) {
      setSelectedKoreksiExamId(visibleExams[0].id);
    }
  }, [visibleExams, selectedKoreksiExamId]);

  const filteredBankSubjects = selectedBankClassId === 'UMUM'
    ? visibleSubjects.filter((s: any) => !s.class_id)
    : visibleSubjects.filter((s: any) => s.class_id === selectedBankClassId);

  const activeSubject = visibleSubjects.find((s: any) => s.id === selectedSubjectId) || null;
  const activeClassObj = classes.find((c: any) => c.id === selectedBankClassId) || null;

  const [adminAlert, setAdminAlert] = useState<string | null>(null);
  const [adminConfirm, setAdminConfirm] = useState<{ message: string; action: () => Promise<void> | void } | null>(null);

  // === EXCEL IMPORT ===
  const handleImportExcelSiswa = (e: any) => {
    const file = e.target.files[0];
    if (!file || !supabase) return;
    const reader = new FileReader();
    reader.onload = async (evt: any) => {
      try {
        if (!supabase) return;
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

        setSaving(true);
        const payloads = data.map((row: any) => {
          const className = row['Kode Kelas'] || row['Kelas'];
          const cls = classes.find((c: any) => c.name === className);
          return { nis: String(row['NIS'] || ''), name: row['Nama Lengkap'] || row['Nama'] || '', class_id: cls?.id || null };
        }).filter((p: any) => p.nis && p.name);

        if (payloads.length > 0) {
          const { error } = await supabase.from('students').upsert(payloads, { onConflict: 'nis' });
          if (error) throw error;
          setAdminAlert(`Berhasil import ${payloads.length} data siswa dari Excel.`);
          onRefresh();
        } else {
          setAdminAlert('Format Excel tidak sesuai atau data kosong. Pastikan ada kolom "NIS" dan "Nama Lengkap".');
        }
      } catch (err: any) { setAdminAlert('Gagal memproses Excel: ' + err.message); } finally { setSaving(false); e.target.value = ''; }
    };
    reader.readAsBinaryString(file);
  };

  // === WORD IMPORT (MAMMOTH) ===
  const handleImportWordSoal = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !selectedSubjectId || !supabase) return;
    setSaving(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const rawHtml = result.value;

      const dbPayload = {
        subject_id: selectedSubjectId,
        question_type: 'essay',
        question_text: rawHtml,
        payload: {}, answer_key: {}, weight: 5,
        order_num: questions.filter((q: any) => q.subjectId === selectedSubjectId).length + 1
      };

      const { error } = await supabase.from('questions').insert(dbPayload);
      if (error) throw error;

      setAdminAlert('File Word berhasil diimpor sebagai teks soal (Esai). Layout Word, teks Arab, dan simbol berhasil dipertahankan. Silakan edit soal jika ingin diubah menjadi Pilihan Ganda.');
      onRefresh();
    } catch (err: any) { setAdminAlert('Gagal membaca file Word: ' + err.message); } finally { setSaving(false); e.target.value = ''; }
  };

  // CRUD ACTIONS
  const saveClass = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    if (classForm.id) {
      const { error } = await supabase.from('classes').update({ name: classForm.name }).eq('id', classForm.id);
      if (error) setAdminAlert(error.message);
      else {
        setClasses(classes.map((c: any) => (c.id === classForm.id ? { ...c, name: classForm.name } : c)));
        setStudents(students.map((s: any) => (s.classId === classForm.id ? { ...s, className: classForm.name } : s)));
      }
    } else {
      const { data, error } = await supabase.from('classes').insert({ name: classForm.name }).select().single();
      if (error) setAdminAlert(error.message);
      else if (data) {
        setClasses([...classes, data]);
        setSelectedBankClassId(data.id);
      }
    }
    setSaving(false); setClassModalOpen(false);
  };

  const saveStudent = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const c = classes.find((c: any) => c.id === studentForm.classId);
    const payload = { nis: studentForm.nis.trim(), name: studentForm.name.trim(), class_id: studentForm.classId || null };

    if (studentForm.oldNis) {
      const { error } = await supabase.from('students').update(payload).eq('nis', studentForm.oldNis);
      if (error) setAdminAlert(error.message);
      else setStudents(students.map((s: any) => s.nis === studentForm.oldNis ? { nis: payload.nis, name: payload.name, classId: studentForm.classId, className: c?.name || 'Umum' } : s));
    } else {
      const { error } = await supabase.from('students').insert(payload);
      if (error) setAdminAlert(error.message);
      else setStudents([...students, { nis: payload.nis, name: payload.name, classId: studentForm.classId, className: c?.name || 'Umum' }]);
    }
    setSaving(false); setStudentModalOpen(false);
  };

  const saveTeacher = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = { username: teacherForm.username.trim(), password: teacherForm.password, name: teacherForm.name.trim(), subject_ids: teacherForm.subjectIds };

    if (teacherForm.id) {
      const { error } = await supabase.from('teachers').update(payload).eq('id', teacherForm.id);
      if (error) setAdminAlert(error.message); else setTeachers(teachers.map((t: any) => (t.id === teacherForm.id ? { ...t, ...teacherForm } : t)));
    } else {
      const { data, error } = await supabase.from('teachers').insert(payload).select().single();
      if (error) setAdminAlert(error.message); else if (data) setTeachers([...teachers, { id: data.id, username: data.username, password: data.password, name: data.name, subjectIds: data.subject_ids || [] }]);
    }
    setSaving(false); setTeacherModalOpen(false);
  };

  const saveSubject = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = {
      class_id: subjectForm.class_id || null,
      code: subjectForm.code.trim().toUpperCase(),
      name: subjectForm.name.trim(),
      grade_level: subjectForm.grade
    };

    if (subjectForm.id) {
      const { error } = await supabase.from('subjects').update(payload).eq('id', subjectForm.id);
      if (error) setAdminAlert(error.message);
      else {
        setSubjects(subjects.map((s: any) => (s.id === subjectForm.id ? { ...s, ...payload } : s)));
        setSelectedBankClassId(payload.class_id || 'UMUM');
      }
    } else {
      const { data, error } = await supabase.from('subjects').insert(payload).select().single();
      if (error) setAdminAlert(error.message);
      else if (data) {
        setSubjects([...subjects, data]);
        setSelectedBankClassId(data.class_id || 'UMUM');
        setSelectedSubjectId(null);
      }
    }
    setSaving(false); setSubjectModalOpen(false);
  };

  const saveExam = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    if (examForm.start_time && examForm.end_time && examForm.end_time <= examForm.start_time) {
      setAdminAlert('Jam Selesai harus lebih akhir daripada Jam Mulai!');
      return;
    }

    setSaving(true);
    const payload = {
      subject_id: examForm.subjectId,
      title: examForm.title.trim(),
      token: examForm.token.trim().toUpperCase(),
      duration_minutes: examForm.duration,
      exam_date: examForm.date || null,
      start_time: examForm.start_time || null,
      end_time: examForm.end_time || null,
      is_active: true
    };

    if (examForm.id) {
      const { error } = await supabase.from('exams').update(payload).eq('id', examForm.id);
      if (error) setAdminAlert(error.message);
      else setExams(exams.map((ex: any) => ex.id === examForm.id ? { ...ex, ...payload, subjectId: payload.subject_id, date: examForm.date, start_time: examForm.start_time, end_time: examForm.end_time } : ex));
    } else {
      const { data, error } = await supabase.from('exams').insert(payload).select().single();
      if (error) setAdminAlert(error.message);
      else if (data) setExams([{ id: data.id, subjectId: data.subject_id, title: data.title, duration_minutes: data.duration_minutes, token: data.token, is_active: data.is_active, date: data.exam_date || '', start_time: data.start_time || '', end_time: data.end_time || '' }, ...exams]);
    }
    setSaving(false); setExamModalOpen(false);
  };

  const saveQuestion = async (e: any) => {
    e.preventDefault();
    if (!supabase || !selectedSubjectId) return;
    setSaving(true);

    const cleanedOptions = questionForm.options.map((o) => o.trim()).filter(Boolean);
    const payloadJson = questionForm.question_type === 'multiple_choice' ? { options: cleanedOptions } : {};
    const answerKeyJson = questionForm.question_type === 'multiple_choice' ? { correct: questionForm.correct } : {};

    const dbPayload = {
      subject_id: selectedSubjectId,
      question_type: questionForm.question_type,
      question_text: questionForm.question_text.trim(),
      payload: payloadJson, answer_key: answerKeyJson, weight: questionForm.question_type === 'essay' ? 5 : 1,
      order_num: questions.filter((q: any) => q.subjectId === selectedSubjectId).length + 1
    };

    if (questionForm.id) {
      const { error } = await supabase.from('questions').update(dbPayload).eq('id', questionForm.id);
      if (error) setAdminAlert(error.message);
      else setQuestions(questions.map((q: any) => q.id === questionForm.id ? { ...q, question_type: dbPayload.question_type, question_text: dbPayload.question_text, payload: payloadJson, answer_key: answerKeyJson } : q));
    } else {
      const { data, error } = await supabase.from('questions').insert(dbPayload).select().single();
      if (error) setAdminAlert(error.message);
      else if (data) setQuestions([...questions, { id: data.id, examId: data.exam_id, subjectId: data.subject_id, question_type: data.question_type, question_text: data.question_text, payload: data.payload, answer_key: data.answer_key, weight: data.weight, order_num: data.order_num }]);
    }
    setSaving(false); setQuestionModalOpen(false);
  };

  const deleteFromSupabase = (tableName: string, setter: any, items: any[], idKey: string, idVal: string, onAfterDelete?: () => void) => {
    setAdminConfirm({
      message: 'Apakah Anda yakin ingin menghapus data ini dari database? Aksi ini tidak dapat dibatalkan.',
      action: async () => {
        if (!supabase) return;
        const { error } = await supabase.from(tableName).delete().eq(idKey, idVal);
        if (error) setAdminAlert(`Gagal menghapus: ${error.message}`);
        else {
          setter(items.filter((i: any) => i[idKey] !== idVal));
          if (onAfterDelete) onAfterDelete();
        }
      }
    });
  };

  const filteredQuestions = questions.filter((q: any) => q.subjectId === selectedSubjectId);

  // ==========================================
  // HELPER REKAP NILAI PER KELAS (SEMUA MAPEL)
  // ==========================================
  const getClassRecapMatrix = (classObj: ClassItem) => {
    const classStudents: StudentItem[] = students
      .filter((s: StudentItem) => s.classId === classObj.id)
      .sort((a: StudentItem, b: StudentItem) => a.name.localeCompare(b.name));

    const classSubjects: SubjectItem[] = visibleSubjects.filter((sub: SubjectItem) => {
      if (sub.class_id === classObj.id) return true;
      if (!sub.class_id) {
        const subExamIds = exams.filter((ex: ExamItem) => ex.subjectId === sub.id).map((ex: ExamItem) => ex.id);
        return examSessions.some(
          (sess: ExamSessionItem) =>
            subExamIds.includes(sess.examId) &&
            classStudents.some((st: StudentItem) => st.nis === sess.nis)
        );
      }
      return false;
    });

    const rows: ClassRecapRow[] = classStudents.map((st: StudentItem, idx: number) => {
      const scoresBySubject: Record<string, number | null> = {};
      const validScores: number[] = [];

      classSubjects.forEach((sub: SubjectItem) => {
        const subExamIds = exams.filter((ex: ExamItem) => ex.subjectId === sub.id).map((ex: ExamItem) => ex.id);
        const studentSessions = examSessions.filter(
          (sess: ExamSessionItem) =>
            sess.nis === st.nis &&
            subExamIds.includes(sess.examId) &&
            (sess.status === 'completed' || sess.status === 'locked')
        );

        if (studentSessions.length > 0) {
          const bestScore = Math.max(...studentSessions.map((sess: ExamSessionItem) => Number(sess.score || 0)));
          scoresBySubject[sub.id] = bestScore;
          validScores.push(bestScore);
        } else {
          scoresBySubject[sub.id] = null;
        }
      });

      const total = validScores.reduce((acc: number, val: number) => acc + val, 0);
      const average = validScores.length > 0 ? (total / validScores.length).toFixed(1) : '-';

      return {
        no: idx + 1,
        nis: st.nis,
        name: st.name,
        className: classObj.name,
        scoresBySubject,
        total: validScores.length > 0 ? total : '-',
        average
      };
    });

    const subjectAverages: Record<string, string> = {};
    classSubjects.forEach((sub: SubjectItem) => {
      const subScores: number[] = rows
        .map((r: ClassRecapRow) => r.scoresBySubject[sub.id])
        .filter((val: number | null | undefined): val is number => val !== null && val !== undefined);
      subjectAverages[sub.id] =
        subScores.length > 0
          ? (subScores.reduce((acc: number, val: number) => acc + val, 0) / subScores.length).toFixed(1)
          : '-';
    });

    return { classObj, classSubjects, rows, subjectAverages };
  };

  const handleDownloadRekapPerKelas = (targetClassId: string) => {
    const targetClasses =
      targetClassId === 'ALL'
        ? classes
        : classes.filter((c: ClassItem) => c.id === targetClassId);

    if (targetClasses.length === 0) {
      setAdminAlert('Tidak ada data kelas untuk diunduh.');
      return;
    }

    const exportDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const tablesHtml = targetClasses
      .map((cls: ClassItem) => {
        const { classSubjects, rows, subjectAverages } = getClassRecapMatrix(cls);
        const totalCols = 5 + classSubjects.length;

        const subjectHeaders = classSubjects
          .map(
            (sub: SubjectItem) =>
              `<th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;text-align:center;">${sub.name}<br/><span style="font-size:11px;font-weight:normal;">(${sub.code})</span></th>`
          )
          .join('');

        const bodyRows =
          rows.length === 0
            ? `<tr><td colspan="${totalCols}" style="border:1px solid #cbd5e1;padding:10px;text-align:center;color:#64748b;">Belum ada data siswa di kelas ${cls.name}</td></tr>`
            : rows
                .map((r: ClassRecapRow) => {
                  const scoreCells = classSubjects
                    .map((sub: SubjectItem) => {
                      const val = r.scoresBySubject[sub.id];
                      return `<td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${
                        val !== null ? val : '-'
                      }</td>`;
                    })
                    .join('');

                  return `
                    <tr>
                      <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${r.no}</td>
                      <td style="border:1px solid #cbd5e1;padding:7px;mso-number-format:'\\@';">${r.nis}</td>
                      <td style="border:1px solid #cbd5e1;padding:7px;">${r.name}</td>
                      <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${r.className}</td>
                      ${scoreCells}
                      <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;font-weight:bold;">${r.total}</td>
                      <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;font-weight:bold;background-color:#f8fafc;">${r.average}</td>
                    </tr>
                  `;
                })
                .join('');

        const avgCells = classSubjects
          .map(
            (sub: SubjectItem) =>
              `<td style="border:1px solid #cbd5e1;padding:7px;text-align:center;font-weight:bold;background-color:#ecfdf5;">${subjectAverages[sub.id]}</td>`
          )
          .join('');

        return `
          <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;margin-bottom:28px;">
            <thead>
              <tr>
                <th colspan="${totalCols}" style="font-size:15px;font-weight:bold;text-align:left;padding:8px 4px;color:#1e293b;">
                  REKAP NILAI UJIAN - KELAS ${cls.name.toUpperCase()} (Dicetak: ${exportDate})
                </th>
              </tr>
              <tr>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:40px;">No</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:110px;">NIS</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;text-align:left;">Nama Siswa</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:100px;">Kelas</th>
                ${subjectHeaders}
                <th style="background-color:#065f46;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:85px;">Total</th>
                <th style="background-color:#065f46;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:90px;">Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              ${bodyRows}
              ${
                rows.length > 0
                  ? `<tr>
                      <td colspan="4" style="border:1px solid #cbd5e1;padding:7px;text-align:right;font-weight:bold;background-color:#ecfdf5;">Rata-rata Kelas per Mapel</td>
                      ${avgCells}
                      <td colspan="2" style="border:1px solid #cbd5e1;padding:7px;background-color:#ecfdf5;"></td>
                    </tr>`
                  : ''
              }
            </tbody>
          </table>
        `;
      })
      .join('');

    const htmlDocument = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8" /></head>
        <body>${tablesHtml}</body>
      </html>
    `;

    const selectedClassObj = classes.find((c: ClassItem) => c.id === targetClassId);
    const safeFileName =
      targetClassId === 'ALL'
        ? 'Rekap_Nilai_Semua_Kelas.xls'
        : `Rekap_Nilai_Kelas_${(selectedClassObj?.name || 'Kelas').replace(/[^a-zA-Z0-9_-]/g, '_')}.xls`;

    const blob = new Blob(['\uFEFF', htmlDocument], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ==========================================
  // HELPER KOREKSI NILAI & EXPORT 100% TERINPUT
  // ==========================================
  const getSessionGradingDetail = (sess: ExamSessionItem) => {
    const exam = exams.find((e: ExamItem) => e.id === sess.examId);
    const examQuestions = questions.filter((q: QuestionItem) => q.subjectId === exam?.subjectId);
    const pgQuestions = examQuestions.filter((q: QuestionItem) => q.question_type === 'multiple_choice');
    const essayQuestions = examQuestions.filter((q: QuestionItem) => q.question_type === 'essay');
    const essayScoresMap: Record<string, any> = sess.answers?.__essay_scores || {};

    let pgCorrectCount = 0;
    pgQuestions.forEach((q: QuestionItem) => {
      if (sess.answers?.[q.id] === q.answer_key?.correct) pgCorrectCount++;
    });
    const pgScore = pgQuestions.length > 0 ? Math.round((pgCorrectCount / pgQuestions.length) * 100) : null;

    let gradedEssayCount = 0;
    let essayScoreSum = 0;
    essayQuestions.forEach((q: QuestionItem) => {
      const rawVal = essayScoresMap[q.id];
      if (rawVal !== undefined && rawVal !== null && rawVal !== '' && !isNaN(Number(rawVal))) {
        gradedEssayCount++;
        essayScoreSum += Number(rawVal);
      }
    });

    const essayAvgScore =
      essayQuestions.length > 0 && gradedEssayCount > 0
        ? Math.round((essayScoreSum / gradedEssayCount) * 10) / 10
        : null;

    const isFinished = sess.status === 'completed' || sess.status === 'locked';
    const isFullyGraded =
      isFinished && (essayQuestions.length === 0 || gradedEssayCount === essayQuestions.length);

    let totalWeight = 0;
    let earnedWeight = 0;
    examQuestions.forEach((q: QuestionItem) => {
      const w = Number(q.weight) || (q.question_type === 'essay' ? 5 : 1);
      totalWeight += w;
      if (q.question_type === 'multiple_choice') {
        if (sess.answers?.[q.id] === q.answer_key?.correct) earnedWeight += w;
      } else {
        const sVal = Number(essayScoresMap[q.id] || 0);
        earnedWeight += (Math.min(100, Math.max(0, sVal)) / 100) * w;
      }
    });

    const computedFinalScore =
      totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : Number(sess.score || 0);

    return {
      exam,
      pgQuestions,
      essayQuestions,
      pgCorrectCount,
      pgScore,
      gradedEssayCount,
      essayAvgScore,
      isFullyGraded,
      computedFinalScore: essayQuestions.length === 0 ? Number(sess.score || computedFinalScore) : computedFinalScore
    };
  };

  const openGradingModal = (sess: ExamSessionItem) => {
    const existingScores = sess.answers?.__essay_scores || {};
    const initialInputs: Record<string, string> = {};
    Object.keys(existingScores).forEach((qId) => {
      if (existingScores[qId] !== undefined && existingScores[qId] !== null) {
        initialInputs[qId] = String(existingScores[qId]);
      }
    });
    setEssayScoreInputs(initialInputs);
    setGradingSession(sess);
  };

  const saveGradingScores = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSession) return;

    const { pgQuestions, essayQuestions } = getSessionGradingDetail(gradingSession);
    const cleanEssayScores: Record<string, number> = {};

    for (const eq of essayQuestions) {
      const raw = essayScoreInputs[eq.id];
      if (raw !== undefined && raw.trim() !== '') {
        const parsed = Number(raw);
        if (isNaN(parsed) || parsed < 0 || parsed > 100) {
          setAdminAlert('Nilai setiap soal esai harus berupa angka antara 0 sampai 100.');
          return;
        }
        cleanEssayScores[eq.id] = parsed;
      }
    }

    const allEssaysInputted = essayQuestions.every((eq) => cleanEssayScores[eq.id] !== undefined);

    let totalWeight = 0;
    let earnedWeight = 0;
    pgQuestions.forEach((q) => {
      const w = Number(q.weight) || 1;
      totalWeight += w;
      if (gradingSession.answers?.[q.id] === q.answer_key?.correct) earnedWeight += w;
    });
    essayQuestions.forEach((q) => {
      const w = Number(q.weight) || 5;
      totalWeight += w;
      const sVal = cleanEssayScores[q.id] ?? 0;
      earnedWeight += (sVal / 100) * w;
    });

    const finalScore =
      totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : Number(gradingSession.score || 0);

    const updatedAnswers = {
      ...(gradingSession.answers || {}),
      __essay_scores: cleanEssayScores,
      __is_fully_graded: allEssaysInputted,
      __graded_at: new Date().toISOString()
    };

    if (supabase) {
      setSaving(true);
      const { error } = await supabase
        .from('exam_sessions')
        .update({ score: finalScore, answers: updatedAnswers })
        .eq('id', gradingSession.id);
      setSaving(false);

      if (error) {
        setAdminAlert(`Gagal menyimpan hasil koreksi: ${error.message}`);
        return;
      }
    }

    setExamSessions((prev) =>
      prev.map((item) =>
        item.id === gradingSession.id ? { ...item, score: finalScore, answers: updatedAnswers } : item
      )
    );
    setGradingSession(null);
    setAdminAlert(
      allEssaysInputted
        ? `Nilai koreksi untuk ${gradingSession.name} berhasil disimpan (100% Terinput). Nilai Akhir: ${finalScore}.`
        : `Sebagian nilai esai untuk ${gradingSession.name} disimpan. Lengkapi seluruh soal esai agar berstatus 100% Terinput.`
    );
  };

  const handleExportKoreksi100 = (targetExamId: string) => {
    const targetExam = visibleExams.find((ex: ExamItem) => ex.id === targetExamId);
    if (!targetExam) {
      setAdminAlert('Pilih paket ujian terlebih dahulu.');
      return;
    }

    const targetSubject = subjects.find((s: SubjectItem) => s.id === targetExam.subjectId);
    const sessionsForExam = examSessions.filter(
      (s: ExamSessionItem) =>
        s.examId === targetExamId &&
        (s.status === 'completed' || s.status === 'locked') &&
        (selectedKoreksiClassFilter === 'ALL' || s.className === selectedKoreksiClassFilter)
    );

    const fullyGradedRows = sessionsForExam
      .map((sess) => ({ sess, detail: getSessionGradingDetail(sess) }))
      .filter((item) => item.detail.isFullyGraded)
      .sort((a, b) => a.sess.className.localeCompare(b.sess.className) || a.sess.name.localeCompare(b.sess.name));

    if (fullyGradedRows.length === 0) {
      setAdminAlert(
        'Belum ada nilai siswa yang 100% selesai diinput pada ujian ini. Silakan selesaikan koreksi nilai terlebih dahulu.'
      );
      return;
    }

    const exportDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const bodyHtml = fullyGradedRows
      .map(
        ({ sess, detail }, idx) => `
        <tr>
          <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${idx + 1}</td>
          <td style="border:1px solid #cbd5e1;padding:7px;mso-number-format:'\\@';">${sess.nis}</td>
          <td style="border:1px solid #cbd5e1;padding:7px;">${sess.name}</td>
          <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${sess.className}</td>
          <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${
            detail.pgScore !== null ? detail.pgScore : '-'
          }</td>
          <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;">${
            detail.essayAvgScore !== null ? detail.essayAvgScore : '-'
          }</td>
          <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;font-weight:bold;background-color:#ecfdf5;">${
            sess.score
          }</td>
          <td style="border:1px solid #cbd5e1;padding:7px;text-align:center;color:#047857;font-weight:bold;">100% Terinput</td>
        </tr>
      `
      )
      .join('');

    const htmlDocument = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8" /></head>
        <body>
          <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:12px;">
            <thead>
              <tr>
                <th colspan="8" style="font-size:15px;font-weight:bold;text-align:left;padding:8px 4px;color:#1e293b;">
                  HASIL KOREKSI NILAI (100% TERINPUT) - ${targetExam.title.toUpperCase()}
                </th>
              </tr>
              <tr>
                <th colspan="8" style="font-size:12px;font-weight:normal;text-align:left;padding:0 4px 10px 4px;color:#475569;">
                  Mata Pelajaran: ${targetSubject?.name || '-'} | Filter Kelas: ${
                    selectedKoreksiClassFilter === 'ALL' ? 'Semua Kelas' : selectedKoreksiClassFilter
                  } | Total 100% Terinput: ${fullyGradedRows.length} Siswa | Dicetak: ${exportDate}
                </th>
              </tr>
              <tr>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:40px;">No</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:110px;">NIS</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;text-align:left;">Nama Siswa</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:100px;">Kelas</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:90px;">Skor PG</th>
                <th style="background-color:#059669;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:90px;">Skor Esai</th>
                <th style="background-color:#065f46;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:95px;">Nilai Akhir</th>
                <th style="background-color:#065f46;color:#ffffff;font-weight:bold;border:1px solid #cbd5e1;padding:8px;width:120px;">Status Input</th>
              </tr>
            </thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        </body>
      </html>
    `;

    const safeTitle = targetExam.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const blob = new Blob(['\uFEFF', htmlDocument], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Koreksi_Nilai_100Persen_${safeTitle}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const navItems = (
    <>
      <p className="px-4 text-xs font-bold text-emerald-300/70 uppercase tracking-wider mt-4 mb-2">Pelaksanaan & Hasil</p>
      <button
        onClick={() => { setActiveTab('monitoring'); setMobileMenuOpen(false); }}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
          activeTab === 'monitoring'
            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
            : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
        }`}
      >
        <Activity size={18} className="mr-3" /> Live Monitoring
      </button>
      <button
        onClick={() => { setActiveTab('koreksi'); setMobileMenuOpen(false); }}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
          activeTab === 'koreksi'
            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
            : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
        }`}
      >
        <CheckSquare size={18} className="mr-3" /> Koreksi Nilai
      </button>
      <button
        onClick={() => { setActiveTab('rekap'); setMobileMenuOpen(false); }}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
          activeTab === 'rekap'
            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
            : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
        }`}
      >
        <Download size={18} className="mr-3" /> Rekap Nilai
      </button>

      <p className="px-4 text-xs font-bold text-emerald-300/70 uppercase tracking-wider mt-8 mb-2">Ujian & Soal</p>
      <button
        onClick={() => { setActiveTab('exams'); setMobileMenuOpen(false); }}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
          activeTab === 'exams'
            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
            : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
        }`}
      >
        <FileText size={18} className="mr-3" /> Jadwal & Ujian
      </button>
      <button
        onClick={() => { setActiveTab('questions'); setMobileMenuOpen(false); }}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
          activeTab === 'questions'
            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
            : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
        }`}
      >
        <LayoutGrid size={18} className="mr-3" /> Bank Soal
      </button>

      {currentUser.role === 'admin' && (
        <>
          <p className="px-4 text-xs font-bold text-emerald-300/70 uppercase tracking-wider mt-8 mb-2">Master Data</p>
          <button
            onClick={() => { setActiveTab('teachers'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
              activeTab === 'teachers'
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
                : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Briefcase size={18} className="mr-3" /> Data Guru
          </button>
          <button
            onClick={() => { setActiveTab('classes'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
              activeTab === 'classes'
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
                : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <LayoutGrid size={18} className="mr-3" /> Data Kelas
          </button>
          <button
            onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition font-semibold ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-950/40'
                : 'text-emerald-100/85 hover:bg-emerald-800/60 hover:text-white'
            }`}
          >
            <Users size={18} className="mr-3" /> Data Siswa
          </button>
        </>
      )}
    </>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center font-extrabold text-lg">
          <ShieldCheck className="mr-2 text-emerald-400" size={24} />
          {currentUser.role === 'admin' ? 'Admin Panel' : 'Panel Guru'}
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-emerald-800/70 text-emerald-100"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 text-emerald-100 p-4 border-b border-emerald-800 space-y-1 z-30">
          {navItems}
          <div className="pt-3 mt-3 border-t border-emerald-800/70 flex gap-2">
            <button
              onClick={onRefresh}
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-800/70 text-emerald-100 text-xs font-bold flex items-center justify-center"
            >
              <RefreshCw size={14} className="mr-1.5" /> Sinkronkan Data
            </button>
            <button
              onClick={() => { localStorage.removeItem('cbt_admin_tab_v1'); onBack(); }}
              className="flex-1 px-3 py-2 rounded-xl bg-red-950/70 text-red-300 text-xs font-bold flex items-center justify-center"
            >
              <LogOut size={14} className="mr-1.5" /> Keluar
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Degradasi Dominan Hijau) */}
      <aside className="w-64 bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 text-emerald-100 hidden md:flex flex-col z-20 shadow-xl shrink-0">
        <div className="p-6 border-b border-emerald-800/70">
          <h1 className="font-extrabold text-white flex items-center text-xl tracking-tight">
            <ShieldCheck className="mr-2 text-emerald-400" size={28} /> {currentUser.role === 'admin' ? 'Admin Panel' : 'Panel Guru'}
          </h1>
          {currentUser.role === 'teacher' && <p className="text-xs text-emerald-300/80 mt-2 font-medium">{currentUser.name}</p>}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">{navItems}</nav>
        <div className="p-4 border-t border-emerald-800/70 space-y-2">
          <button onClick={onRefresh} className="w-full text-left px-4 py-2.5 rounded-xl flex items-center text-emerald-200/80 hover:text-white hover:bg-emerald-800/60 transition font-semibold text-sm">
            <RefreshCw size={16} className="mr-3" /> Sinkronkan Data
          </button>
          <button onClick={() => { localStorage.removeItem('cbt_admin_tab_v1'); onBack(); }} className="w-full text-left px-4 py-3 rounded-xl flex items-center text-emerald-200/80 hover:text-red-300 hover:bg-emerald-800/60 transition font-bold">
            <LogOut size={18} className="mr-3" /> Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        {/* EXAMS TAB (JADWAL & UJIAN DENGAN TANGGAL & JAM) */}
        {activeTab === 'exams' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Jadwal & Paket Ujian</h2>
                <p className="text-slate-500 mt-1 font-medium">Atur tanggal, jam mulai, jam selesai, dan token agar siswa hanya dapat mengerjakan sesuai jadwal</p>
              </div>
              <button
                onClick={() => {
                  if (visibleSubjects.length === 0) { setAdminAlert('Tambahkan Mapel terlebih dahulu di menu Bank Soal.'); return; }
                  const today = new Date();
                  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  setExamForm({ id: '', title: '', subjectId: visibleSubjects[0]?.id || '', token: '', duration: 90, date: defaultDate, start_time: '07:30', end_time: '09:30' });
                  setExamModalOpen(true);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center"
              >
                <PlusCircle size={18} className="mr-2" /> Buat Jadwal Ujian
              </button>
            </div>

            <div className="grid gap-4">
              {visibleExams.map((ex: any) => {
                const sub = subjects.find((s: any) => s.id === ex.subjectId);
                const subClass = classes.find((c: any) => c.id === sub?.class_id);

                const now = new Date();
                const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                const startStr = ex.start_time ? ex.start_time.substring(0, 5) : '';
                const endStr = ex.end_time ? ex.end_time.substring(0, 5) : '';

                let scheduleStatus = { label: 'Jadwal Fleksibel', style: 'bg-slate-100 text-slate-600' };
                if (ex.date) {
                  if (currentDateStr < ex.date || (currentDateStr === ex.date && startStr && currentTimeStr < startStr)) {
                    scheduleStatus = { label: 'Belum Mulai / Terjadwal', style: 'bg-amber-100 text-amber-800' };
                  } else if (currentDateStr > ex.date || (currentDateStr === ex.date && endStr && currentTimeStr > endStr)) {
                    scheduleStatus = { label: 'Waktu Ujian Berakhir', style: 'bg-red-100 text-red-700' };
                  } else {
                    scheduleStatus = { label: 'Sedang Berlangsung', style: 'bg-emerald-100 text-emerald-800' };
                  }
                }

                const formattedDate = ex.date
                  ? new Date(ex.date + 'T00:00:00').toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'Tanggal belum diatur';

                return (
                  <div key={ex.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg uppercase">{sub?.name || 'Mapel'}</span>
                        {subClass && <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">{subClass.name}</span>}
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${scheduleStatus.style}`}>{scheduleStatus.label}</span>
                      </div>
                      <h3 className="font-extrabold text-xl text-slate-800">{ex.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 font-medium pt-1">
                        <span className="inline-flex items-center">
                          <Calendar size={16} className="mr-1.5 text-indigo-500" />
                          <strong className="text-slate-800">{formattedDate}</strong>
                        </span>
                        <span className="inline-flex items-center">
                          <Clock size={16} className="mr-1.5 text-indigo-500" />
                          Jam: <strong className="text-slate-800 ml-1">{startStr || '--:--'} - {endStr || '--:--'} WIB</strong>
                        </span>
                        <span>
                          Token: <strong className="font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">{ex.token}</strong>
                        </span>
                        <span>
                          Durasi: <strong className="text-slate-800">{ex.duration_minutes} Menit</strong>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                      <button onClick={() => { setExamForm({ id: ex.id, title: ex.title, subjectId: ex.subjectId, token: ex.token, duration: ex.duration_minutes, date: ex.date || '', start_time: ex.start_time || '', end_time: ex.end_time || '' }); setExamModalOpen(true); }} className="p-2.5 text-amber-500 bg-amber-50 hover:bg-amber-100 rounded-xl transition"><Edit size={18} /></button>
                      <button onClick={() => deleteFromSupabase('exams', setExams, exams, 'id', ex.id)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition"><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              })}
              {visibleExams.length === 0 && <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-3xl text-slate-500 font-medium">Belum ada paket ujian dibuat.</div>}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* QUESTIONS TAB (BANK SOAL: TAB KELAS -> KARTU MAPEL)  */}
        {/* ==================================================== */}
        {activeTab === 'questions' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Bank Soal</h2>
                <p className="text-slate-500 mt-1 font-medium">
                  {selectedSubjectId
                    ? 'Lihat, tambah, atau edit butir soal pada mata pelajaran terpilih'
                    : 'Pilih tab kelas, lalu klik kartu mata pelajaran untuk melihat dan mengedit soal'}
                </p>
              </div>
              {currentUser.role === 'admin' && !selectedSubjectId && (
                <button
                  onClick={() => {
                    setSubjectForm({
                      id: '',
                      code: '',
                      name: '',
                      grade: '',
                      class_id: selectedBankClassId === 'UMUM' ? '' : selectedBankClassId
                    });
                    setSubjectModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center"
                >
                  <PlusCircle size={18} className="mr-2" /> Tambah Mapel
                </button>
              )}
            </div>

            {/* 1. TAB KELAS (SINKRON DENGAN MENU KELAS) */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-6 flex overflow-x-auto gap-2">
              {classes.map((cls: any) => {
                const mapelCount = visibleSubjects.filter((s: any) => s.class_id === cls.id).length;
                const isActive = selectedBankClassId === cls.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setSelectedBankClassId(cls.id);
                      setSelectedSubjectId(null);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{cls.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {mapelCount}
                    </span>
                  </button>
                );
              })}

              {(visibleSubjects.some((s: any) => !s.class_id) || classes.length === 0) && (
                <button
                  onClick={() => {
                    setSelectedBankClassId('UMUM');
                    setSelectedSubjectId(null);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedBankClassId === 'UMUM'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>Umum</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                      selectedBankClassId === 'UMUM' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {visibleSubjects.filter((s: any) => !s.class_id).length}
                  </span>
                </button>
              )}
            </div>

            {/* 2A. TAMPILAN KARTU MAPEL (SEBELUM DI-KLIK) */}
            {!selectedSubjectId ? (
              <div>
                {filteredBankSubjects.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={32} />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-800 mb-1">
                      Belum Ada Mata Pelajaran di {activeClassObj ? activeClassObj.name : 'Kategori Ini'}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mb-6 max-w-md mx-auto">
                      Tambahkan mata pelajaran untuk kelas ini agar Anda dapat mulai menyusun bank soal.
                    </p>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setSubjectForm({
                            id: '',
                            code: '',
                            name: '',
                            grade: '',
                            class_id: selectedBankClassId === 'UMUM' ? '' : selectedBankClassId
                          });
                          setSubjectModalOpen(true);
                        }}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition inline-flex items-center"
                      >
                        <PlusCircle size={18} className="mr-2" /> Tambah Mapel di {activeClassObj ? activeClassObj.name : 'Umum'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBankSubjects.map((sub: any) => {
                      const subQuestions = questions.filter((q: any) => q.subjectId === sub.id);
                      const pgCount = subQuestions.filter((q: any) => q.question_type === 'multiple_choice').length;
                      const essayCount = subQuestions.filter((q: any) => q.question_type === 'essay').length;
                      const subClass = classes.find((c: any) => c.id === sub.class_id);

                      return (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSubjectId(sub.id)}
                          className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                          <div>
                            <div className="flex items-start justify-between gap-2 mb-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                                  <BookOpen size={22} />
                                </div>
                                <div>
                                  <span className="inline-block font-mono text-xs font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                    {sub.code}
                                  </span>
                                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                                    {subClass ? subClass.name : 'Umum'}
                                  </p>
                                </div>
                              </div>

                              {currentUser.role === 'admin' && (
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    title="Edit Mata Pelajaran"
                                    onClick={() => {
                                      setSubjectForm({
                                        id: sub.id,
                                        code: sub.code,
                                        name: sub.name,
                                        grade: sub.grade_level || '',
                                        class_id: sub.class_id || ''
                                      });
                                      setSubjectModalOpen(true);
                                    }}
                                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    title="Hapus Mata Pelajaran"
                                    onClick={() =>
                                      deleteFromSupabase('subjects', setSubjects, subjects, 'id', sub.id, () => {
                                        if (selectedSubjectId === sub.id) setSelectedSubjectId(null);
                                      })
                                    }
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>

                            <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                              {sub.name}
                            </h3>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-sm font-extrabold text-slate-700">
                                {subQuestions.length} Soal
                              </span>
                              {subQuestions.length > 0 && (
                                <span className="text-xs text-slate-400 font-semibold ml-2">
                                  ({pgCount} PG • {essayCount} Esai)
                                </span>
                              )}
                            </div>
                            <span className="inline-flex items-center text-xs font-extrabold text-indigo-600 group-hover:translate-x-1 transition-transform">
                              Lihat & Edit <ChevronRight size={16} className="ml-0.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* 2B. TAMPILAN DETAIL & EDIT SOAL SETELAH KARTU MAPEL DI-KLIK */
              <div className="animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border border-slate-200 p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedSubjectId(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center text-sm shrink-0"
                    >
                      <ArrowLeft size={16} className="mr-2" /> Kembali
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md uppercase">
                          {activeSubject?.code}
                        </span>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                          {activeClassObj ? activeClassObj.name : 'Umum'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
                        {activeSubject?.name}
                      </h3>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && activeSubject && (
                    <button
                      onClick={() => {
                        setSubjectForm({
                          id: activeSubject.id,
                          code: activeSubject.code,
                          name: activeSubject.name,
                          grade: activeSubject.grade_level || '',
                          class_id: activeSubject.class_id || ''
                        });
                        setSubjectModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl transition flex items-center text-sm self-start sm:self-center"
                    >
                      <Edit size={16} className="mr-2" /> Edit Info Mapel
                    </button>
                  )}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                    <span className="font-bold text-slate-700">Daftar Soal ({filteredQuestions.length} Soal)</span>
                    <div className="flex gap-2">
                      <label className="text-sm px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition flex items-center cursor-pointer shadow-sm">
                        <FileText size={16} className="mr-1.5" /> Import Word (.docx)
                        <input type="file" accept=".docx" className="hidden" onChange={handleImportWordSoal} />
                      </label>
                      <button
                        onClick={() => {
                          setQuestionForm({ id: '', question_type: 'multiple_choice', question_text: '', options: ['', '', '', '', ''], correct: '' });
                          setQuestionModalOpen(true);
                        }}
                        className="text-sm px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm"
                      >
                        <PlusCircle size={16} className="mr-1.5" /> Tambah Soal
                      </button>
                    </div>
                  </div>
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-bold w-12">No</th>
                        <th className="px-6 py-4 font-bold">Pertanyaan</th>
                        <th className="px-6 py-4 font-bold">Tipe</th>
                        <th className="px-6 py-4 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">
                            Belum ada soal pada mata pelajaran ini. Klik <strong>+ Tambah Soal</strong> atau <strong>Import Word</strong> untuk mulai menambahkan.
                          </td>
                        </tr>
                      ) : (
                        filteredQuestions.map((q: any, idx: number) => (
                          <tr key={q.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold">{idx + 1}</td>
                            <td className="px-6 py-4">
                              <div className="line-clamp-2 font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: q.question_text }}></div>
                              {q.question_type === 'multiple_choice' && q.answer_key?.correct && (
                                <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">Kunci: {q.answer_key.correct}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                {q.question_type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex gap-1 justify-center">
                                <button
                                  onClick={() => {
                                    const opts = q.payload?.options || [];
                                    setQuestionForm({
                                      id: q.id,
                                      question_type: q.question_type,
                                      question_text: q.question_text,
                                      options: [opts[0] || '', opts[1] || '', opts[2] || '', opts[3] || '', opts[4] || ''],
                                      correct: q.answer_key?.correct || ''
                                    });
                                    setQuestionModalOpen(true);
                                  }}
                                  className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => deleteFromSupabase('questions', setQuestions, questions, 'id', q.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <div><h2 className="text-3xl font-extrabold text-slate-800">Data Siswa</h2></div>
              <div className="flex gap-2 flex-wrap justify-end">
                <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none" value={selectedClassFilter} onChange={(e) => setSelectedClassFilter(e.target.value)}>
                  <option value="ALL">Semua Kelas</option>
                  {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center cursor-pointer text-sm">
                  <Download size={18} className="mr-2" /> Import Excel
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcelSiswa} />
                </label>
                <button onClick={() => { setStudentForm({ oldNis: '', nis: '', name: '', classId: '' }); setStudentModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center text-sm"><PlusCircle size={18} className="mr-2" /> Tambah Siswa</button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold">NIS</th><th className="px-6 py-4 font-bold">Nama Lengkap</th><th className="px-6 py-4 font-bold">Kelas</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.filter((s: any) => selectedClassFilter === 'ALL' || s.classId === selectedClassFilter).length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada data siswa terdaftar.</td></tr>
                  ) : (
                    students.filter((s: any) => selectedClassFilter === 'ALL' || s.classId === selectedClassFilter).map((s: any) => (
                      <tr key={s.nis} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">{s.nis}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                        <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-bold text-xs">{s.className}</span></td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => { setStudentForm({ oldNis: s.nis, nis: s.nis, name: s.name, classId: s.classId }); setStudentModalOpen(true); }} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => deleteFromSupabase('students', setStudents, students, 'nis', s.nis)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLASSES TAB */}
        {activeTab === 'classes' && currentUser.role === 'admin' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Data Kelas</h2>
                <p className="text-slate-500 mt-1 font-medium">Daftar kelas otomatis tersinkronisasi dengan Tab Kelas pada Bank Soal</p>
              </div>
              <button onClick={() => { setClassForm({ id: '', name: '' }); setClassModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center"><PlusCircle size={18} className="mr-2" /> Tambah Kelas</button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold">Nama Kelas</th>
                    <th className="px-6 py-4 font-bold text-center">Jumlah Mapel</th>
                    <th className="px-6 py-4 font-bold text-center">Jumlah Siswa</th>
                    <th className="px-6 py-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada data kelas terdaftar.</td></tr>
                  ) : (
                    classes.map((c: any) => {
                      const studentCount = students.filter((s: any) => s.classId === c.id).length;
                      const subjectCount = subjects.filter((s: any) => s.class_id === c.id).length;
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                          <td className="px-6 py-4 text-center"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-bold text-xs">{subjectCount} Mapel</span></td>
                          <td className="px-6 py-4 text-center"><span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-bold text-xs">{studentCount} Siswa</span></td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-1 justify-center">
                              <button onClick={() => { setClassForm({ id: c.id, name: c.name }); setClassModalOpen(true); }} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit size={16} /></button>
                              <button onClick={() => deleteFromSupabase('classes', setClasses, classes, 'id', c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEACHERS TAB */}
        {activeTab === 'teachers' && currentUser.role === 'admin' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <div><h2 className="text-3xl font-extrabold text-slate-800">Data Guru</h2><p className="text-slate-500 mt-1 font-medium">Kelola akun guru dan tugas mata pelajaran</p></div>
              <button onClick={() => { setTeacherForm({ id: '', username: '', password: '', name: '', subjectIds: [] }); setTeacherModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition flex items-center"><PlusCircle size={18} className="mr-2" /> Tambah Guru</button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold">Nama Guru</th><th className="px-6 py-4 font-bold">Username</th><th className="px-6 py-4 font-bold">Mapel yang Diampu</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada akun guru terdaftar.</td></tr>
                  ) : (
                    teachers.map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-bold text-slate-800">{t.name}</td>
                        <td className="px-6 py-4 font-mono font-medium">{t.username}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {t.subjectIds.map((sid: string) => {
                              const mapel = subjects.find((s: any) => s.id === sid);
                              const mapelClass = classes.find((c: any) => c.id === mapel?.class_id);
                              return (
                                <span key={sid} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-md text-xs font-bold">
                                  {mapel?.name || 'Mata Pelajaran'}{mapelClass ? ` (${mapelClass.name})` : ''}
                                </span>
                              );
                            })}
                            {t.subjectIds.length === 0 && <span className="text-slate-400 italic text-xs">Belum ada mapel</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => { setTeacherForm({ id: t.id, username: t.username, password: t.password, name: t.name, subjectIds: t.subjectIds }); setTeacherModalOpen(true); }} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => deleteFromSupabase('teachers', setTeachers, teachers, 'id', t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LIVE MONITORING TAB */}
        {activeTab === 'monitoring' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-extrabold text-slate-800">Live Monitoring</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Realtime</span>
                </div>
                <p className="text-slate-500 mt-1 font-medium">Pantau status ujian siswa secara langsung dan reset sesi (Reset Login).</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold">Peserta</th><th className="px-6 py-4 font-bold">Ujian</th><th className="px-6 py-4 font-bold text-center">Status</th><th className="px-6 py-4 font-bold text-center">Nilai PG</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examSessions.filter((s: any) => visibleExamIds.includes(s.examId)).length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada aktivitas ujian saat ini.</td></tr>
                  ) : (
                    examSessions.filter((s: any) => visibleExamIds.includes(s.examId)).map((sess: any) => {
                      const ex = exams.find((e: any) => e.id === sess.examId);
                      return (
                        <tr key={sess.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4"><div className="font-bold text-slate-800">{sess.name}</div><div className="text-xs text-slate-500">{sess.nis} • Kelas: {sess.className}</div></td>
                          <td className="px-6 py-4 font-bold text-slate-700">{ex?.title || 'Paket Ujian'}</td>
                          <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-lg font-bold text-xs uppercase ${sess.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : sess.status === 'locked' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{sess.status}</span></td>
                          <td className="px-6 py-4 text-center font-extrabold text-slate-800 text-lg">{sess.score ?? '-'}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => { setAdminConfirm({ message: `Reset sesi ujian untuk ${sess.name}? Ini akan menghapus status kunci.`, action: async () => { if (!supabase) return; const { error } = await supabase.from('exam_sessions').delete().eq('id', sess.id); if (error) setAdminAlert(error.message); else setExamSessions(examSessions.filter((s: any) => s.id !== sess.id)); } }); }} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold text-xs flex items-center mx-auto transition"><RefreshCw size={14} className="mr-1" /> Reset Login</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KOREKSI NILAI TAB (MENU KOREKSI TERSENDIRI & EXPORT 100% TERINPUT) */}
        {activeTab === 'koreksi' && (() => {
          const activeKoreksiExam = visibleExams.find((ex: ExamItem) => ex.id === selectedKoreksiExamId) || null;
          const activeKoreksiSub = subjects.find((s: SubjectItem) => s.id === activeKoreksiExam?.subjectId);
          const examFinishedSessions = examSessions.filter(
            (s: ExamSessionItem) =>
              s.examId === selectedKoreksiExamId &&
              (s.status === 'completed' || s.status === 'locked') &&
              (selectedKoreksiClassFilter === 'ALL' || s.className === selectedKoreksiClassFilter)
          );

          const enrichedSessions = examFinishedSessions.map((sess) => ({
            sess,
            detail: getSessionGradingDetail(sess)
          }));

          const fullyGradedCount = enrichedSessions.filter((item) => item.detail.isFullyGraded).length;
          const ungradedCount = enrichedSessions.length - fullyGradedCount;
          const progressPercent =
            enrichedSessions.length > 0 ? Math.round((fullyGradedCount / enrichedSessions.length) * 100) : 0;

          const filteredKoreksiList = enrichedSessions.filter(({ detail }) => {
            if (selectedKoreksiStatusFilter === 'GRADED') return detail.isFullyGraded;
            if (selectedKoreksiStatusFilter === 'UNGRADED') return !detail.isFullyGraded;
            return true;
          });

          return (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-6">
              <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800">Koreksi Nilai Ujian</h2>
                  <p className="text-slate-500 mt-1 font-medium">
                    Periksa jawaban soal uraian/esai, lengkapi input nilai hingga 100%, dan ekspor hasil yang telah terinput.
                  </p>
                </div>

                <button
                  onClick={() => handleExportKoreksi100(selectedKoreksiExamId)}
                  className={`px-5 py-2.5 font-bold rounded-xl shadow-md transition flex items-center ${
                    fullyGradedCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  }`}
                >
                  <Download size={18} className="mr-2" />
                  Export Nilai 100% Terinput ({fullyGradedCount})
                </button>
              </div>

              {/* Filter Ujian, Kelas, & Status Koreksi */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Pilih Paket Ujian
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-emerald-500"
                    value={selectedKoreksiExamId}
                    onChange={(e) => setSelectedKoreksiExamId(e.target.value)}
                  >
                    {visibleExams.length === 0 ? (
                      <option value="">-- Belum Ada Paket Ujian --</option>
                    ) : (
                      visibleExams.map((ex: ExamItem) => {
                        const sub = subjects.find((s: SubjectItem) => s.id === ex.subjectId);
                        return (
                          <option key={ex.id} value={ex.id}>
                            {ex.title} {sub ? `(${sub.name})` : ''}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Filter Kelas
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-emerald-500"
                    value={selectedKoreksiClassFilter}
                    onChange={(e) => setSelectedKoreksiClassFilter(e.target.value)}
                  >
                    <option value="ALL">Semua Kelas</option>
                    {classes.map((c: ClassItem) => (
                      <option key={c.id} value={c.name}>
                        Kelas {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Status Input Nilai
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-emerald-500"
                    value={selectedKoreksiStatusFilter}
                    onChange={(e) => setSelectedKoreksiStatusFilter(e.target.value as any)}
                  >
                    <option value="ALL">Semua Peserta ({enrichedSessions.length})</option>
                    <option value="GRADED">100% Sudah Diinput ({fullyGradedCount})</option>
                    <option value="UNGRADED">Belum 100% Diinput ({ungradedCount})</option>
                  </select>
                </div>
              </div>

              {/* Kartu Ringkasan Progres Input Nilai */}
              {activeKoreksiExam && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg">
                        {activeKoreksiSub?.name || 'Mata Pelajaran'}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-2">{activeKoreksiExam.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 font-medium">Total Selesai: </span>
                        <strong className="text-slate-800">{enrichedSessions.length}</strong>
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <span className="text-emerald-700 font-medium">100% Terinput: </span>
                        <strong className="text-emerald-800">{fullyGradedCount}</strong>
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200">
                        <span className="text-amber-700 font-medium">Belum Lengkap: </span>
                        <strong className="text-amber-800">{ungradedCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600">Kelengkapan Input Nilai Peserta</span>
                      <span className={progressPercent === 100 && enrichedSessions.length > 0 ? 'text-emerald-600' : 'text-indigo-600'}>
                        {progressPercent}% ({fullyGradedCount}/{enrichedSessions.length} Siswa)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          progressPercent === 100 && enrichedSessions.length > 0 ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tabel Peserta Koreksi Nilai */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-bold w-12">No</th>
                        <th className="px-6 py-4 font-bold">Peserta</th>
                        <th className="px-6 py-4 font-bold text-center">Skor PG</th>
                        <th className="px-6 py-4 font-bold text-center">Koreksi Esai</th>
                        <th className="px-6 py-4 font-bold text-center">Nilai Akhir</th>
                        <th className="px-6 py-4 font-bold text-center">Status Input</th>
                        <th className="px-6 py-4 font-bold text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredKoreksiList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-medium">
                            Tidak ada data peserta yang selesai ujian pada filter yang dipilih.
                          </td>
                        </tr>
                      ) : (
                        filteredKoreksiList.map(({ sess, detail }, idx) => (
                          <tr key={sess.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold">{idx + 1}</td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">{sess.name}</div>
                              <div className="text-xs text-slate-500">
                                {sess.nis} • Kelas: {sess.className}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {detail.pgQuestions.length > 0 ? (
                                <div>
                                  <span className="font-extrabold text-slate-800">{detail.pgScore}</span>
                                  <div className="text-[11px] text-slate-400">
                                    ({detail.pgCorrectCount}/{detail.pgQuestions.length} benar)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs font-semibold">Tidak ada PG</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {detail.essayQuestions.length > 0 ? (
                                <div>
                                  <span className="font-extrabold text-slate-800">
                                    {detail.essayAvgScore !== null ? detail.essayAvgScore : '-'}
                                  </span>
                                  <div className="text-[11px] text-slate-500">
                                    {detail.gradedEssayCount}/{detail.essayQuestions.length} soal dinilai
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs font-semibold">Tidak ada Esai</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-block min-w-[46px] px-3 py-1 rounded-xl font-extrabold text-base bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {sess.score}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {detail.isFullyGraded ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
                                  100% Terinput
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                                  Belum 100% ({detail.gradedEssayCount}/{detail.essayQuestions.length})
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => openGradingModal(sess)}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs inline-flex items-center shadow-sm transition"
                              >
                                <Edit size={14} className="mr-1.5" /> Koreksi & Input
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* REKAP NILAI TAB (MATRIKS & DOWNLOAD PER KELAS SEMUA MAPEL) */}
        {activeTab === 'rekap' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-8">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Rekap Hasil Ujian</h2>
                <p className="text-slate-500 mt-1 font-medium">Lihat dan unduh rekap nilai per kelas yang mencakup seluruh mata pelajaran.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Pilih Kelas Rekap
                  </label>
                  <select
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-emerald-500 shadow-sm"
                    value={selectedRekapClassId}
                    onChange={(e) => setSelectedRekapClassId(e.target.value)}
                  >
                    {classes.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        Kelas {c.name}
                      </option>
                    ))}
                    <option value="ALL">Semua Kelas</option>
                  </select>
                </div>

                <div className="self-end">
                  <button
                    onClick={() => handleDownloadRekapPerKelas(selectedRekapClassId)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center"
                  >
                    <Download size={18} className="mr-2" />
                    {selectedRekapClassId === 'ALL'
                      ? 'Download Rekap Semua Kelas (.xls)'
                      : `Download Rekap ${
                          classes.find((c: any) => c.id === selectedRekapClassId)?.name || 'Kelas'
                        } (.xls)`}
                  </button>
                </div>
              </div>
            </div>

            {/* Tabel Matriks Nilai Per Kelas (Semua Mapel) */}
            {classes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500 font-medium">
                Belum ada data kelas terdaftar untuk ditampilkan rekap nilainya.
              </div>
            ) : (
              (selectedRekapClassId === 'ALL'
                ? classes
                : classes.filter((c: any) => c.id === selectedRekapClassId)
              ).map((cls: ClassItem) => {
                const { classSubjects, rows, subjectAverages } = getClassRecapMatrix(cls);
                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-800">
                          Matriks Nilai Kelas {cls.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {rows.length} Siswa • {classSubjects.length} Mata Pelajaran
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadRekapPerKelas(cls.id)}
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs transition flex items-center"
                      >
                        <Download size={14} className="mr-1.5" /> Unduh Kelas {cls.name}
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-white border-b border-slate-200 text-xs uppercase text-slate-700">
                          <tr>
                            <th className="px-4 py-3.5 font-extrabold w-12 text-center">No</th>
                            <th className="px-4 py-3.5 font-extrabold">NIS</th>
                            <th className="px-4 py-3.5 font-extrabold min-w-[180px]">Nama Siswa</th>
                            {classSubjects.map((sub: SubjectItem) => (
                              <th
                                key={sub.id}
                                className="px-4 py-3.5 font-extrabold text-center min-w-[130px] bg-emerald-50/50 text-emerald-900"
                              >
                                <div>{sub.name}</div>
                                <div className="text-[10px] font-mono text-emerald-600 font-bold">
                                  {sub.code}
                                </div>
                              </th>
                            ))}
                            <th className="px-4 py-3.5 font-extrabold text-center bg-slate-50">
                              Total
                            </th>
                            <th className="px-4 py-3.5 font-extrabold text-center bg-slate-50">
                              Rata-rata
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rows.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5 + classSubjects.length}
                                className="px-6 py-8 text-center text-slate-500 font-medium"
                              >
                                Belum ada siswa terdaftar di kelas {cls.name}.
                              </td>
                            </tr>
                          ) : (
                            rows.map((r: ClassRecapRow) => (
                              <tr key={r.nis} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-3.5 text-center font-semibold">{r.no}</td>
                                <td className="px-4 py-3.5 font-mono font-bold text-slate-700">
                                  {r.nis}
                                </td>
                                <td className="px-4 py-3.5 font-bold text-slate-800">{r.name}</td>
                                {classSubjects.map((sub: SubjectItem) => {
                                  const val = r.scoresBySubject[sub.id];
                                  return (
                                    <td key={sub.id} className="px-4 py-3.5 text-center">
                                      {val !== null ? (
                                        <span className="inline-block min-w-[42px] px-2.5 py-1 rounded-lg font-extrabold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          {val}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-semibold">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-3.5 text-center font-extrabold text-slate-800 bg-slate-50/60">
                                  {r.total}
                                </td>
                                <td className="px-4 py-3.5 text-center font-extrabold text-emerald-700 bg-slate-50/60">
                                  {r.average}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {rows.length > 0 && classSubjects.length > 0 && (
                          <tfoot className="bg-emerald-50/50 border-t border-slate-200 font-bold text-xs text-slate-700">
                            <tr>
                              <td colSpan={3} className="px-4 py-3 text-right uppercase tracking-wide">
                                Rata-rata Kelas per Mapel
                              </td>
                              {classSubjects.map((sub: SubjectItem) => (
                                <td
                                  key={sub.id}
                                  className="px-4 py-3 text-center font-extrabold text-emerald-800"
                                >
                                  {subjectAverages[sub.id]}
                                </td>
                              ))}
                              <td colSpan={2} className="px-4 py-3"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                );
              })
            )}

            {/* Ringkasan Statistik Per Paket Ujian */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6">
              <h3 className="text-lg font-extrabold text-slate-800 mb-4">Ringkasan Statistik per Paket Ujian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {visibleExams.map((ex: any) => {
                  const sub = subjects.find((s: any) => s.id === ex.subjectId);
                  const completed = examSessions.filter((s: any) => s.examId === ex.id && s.status === 'completed');
                  const avgScore = completed.length > 0 ? (completed.reduce((acc: number, val: any) => acc + (val.score || 0), 0) / completed.length).toFixed(1) : 0;
                  return (
                    <div key={ex.id} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition bg-slate-50">
                      <div className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-wider">{sub?.name || 'Mapel'}</div>
                      <h3 className="font-extrabold text-lg text-slate-800 mb-4">{ex.title}</h3>
                      <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-slate-500">Siswa Selesai:</span><span className="font-bold text-slate-800 bg-slate-200 px-2 rounded-md">{completed.length}</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm font-medium text-slate-500">Rata-rata Nilai:</span><span className="font-extrabold text-emerald-600 bg-emerald-100 px-2 rounded-md">{avgScore}</span></div>
                    </div>
                  );
                })}
              </div>
              {visibleExams.length === 0 && <p className="text-slate-500 font-medium py-6 text-center">Belum ada data ujian untuk direkap.</p>}
            </div>
          </div>
        )}

        {/* MODALS */}
        <Modal title={`${classForm.id ? 'Edit' : 'Tambah'} Kelas`} isOpen={isClassModalOpen} onClose={() => setClassModalOpen(false)}>
          <form onSubmit={saveClass} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelas</label><input required autoFocus className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none" value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} placeholder="Contoh: X TKJ 1" /></div>
            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Kelas'}</button>
          </form>
        </Modal>

        <Modal title={`${teacherForm.id ? 'Edit' : 'Tambah'} Guru`} isOpen={isTeacherModalOpen} onClose={() => setTeacherModalOpen(false)}>
          <form onSubmit={saveTeacher} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label><input required autoFocus className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} placeholder="Nama Guru" /></div>
            <div className="flex gap-4"><div className="flex-1"><label className="block text-xs font-bold text-slate-700 mb-1">Username</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" value={teacherForm.username} onChange={e => setTeacherForm({ ...teacherForm, username: e.target.value })} placeholder="Username" /></div><div className="flex-1"><label className="block text-xs font-bold text-slate-700 mb-1">Password</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} placeholder="Password" /></div></div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Mapel yang Diampu</label>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                {subjects.length === 0 ? <p className="text-xs text-slate-400 italic">Tambahkan mata pelajaran terlebih dahulu di menu Bank Soal.</p> : subjects.map((s: any) => {
                  const sClass = classes.find((c: any) => c.id === s.class_id);
                  return (
                    <label key={s.id} className="flex items-center gap-3 cursor-pointer p-1">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" checked={teacherForm.subjectIds.includes(s.id)} onChange={(e) => { if (e.target.checked) setTeacherForm({ ...teacherForm, subjectIds: [...teacherForm.subjectIds, s.id] }); else setTeacherForm({ ...teacherForm, subjectIds: teacherForm.subjectIds.filter((id: string) => id !== s.id) }); }} />
                      <span className="text-sm font-semibold text-slate-700">
                        {s.name} <span className="text-slate-400">({s.code}{sClass ? ` - ${sClass.name}` : ''})</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 mt-2 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Akun Guru'}</button>
          </form>
        </Modal>

        <Modal title={`${studentForm.oldNis ? 'Edit' : 'Tambah'} Siswa`} isOpen={isStudentModalOpen} onClose={() => setStudentModalOpen(false)}>
          <form onSubmit={saveStudent} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">NIS</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={studentForm.nis} onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })} placeholder="Nomor Induk" /></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="Nama Siswa" /></div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelas</label>
              <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={studentForm.classId} onChange={e => setStudentForm({ ...studentForm, classId: e.target.value })}>
                <option value="" disabled>-- Pilih Kelas --</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Siswa'}</button>
          </form>
        </Modal>

        <Modal title={`${subjectForm.id ? 'Edit' : 'Tambah'} Mata Pelajaran`} isOpen={isSubjectModalOpen} onClose={() => setSubjectModalOpen(false)}>
          <form onSubmit={saveSubject} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelas</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={subjectForm.class_id} onChange={e => setSubjectForm({ ...subjectForm, class_id: e.target.value })}>
                <option value="">-- Umum / Semua Kelas --</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Kode Mapel</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })} placeholder="Contoh: MTK" /></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Nama Mapel</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} placeholder="Contoh: Matematika" /></div>
            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Mapel'}</button>
          </form>
        </Modal>

        <Modal title={`${examForm.id ? 'Edit' : 'Buat'} Jadwal & Paket Ujian`} isOpen={isExamModalOpen} onClose={() => setExamModalOpen(false)}>
          <form onSubmit={saveExam} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Pilih Mapel</label>
              <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={examForm.subjectId} onChange={e => setExamForm({ ...examForm, subjectId: e.target.value })}>
                <option value="" disabled>-- Pilih Mapel --</option>
                {visibleSubjects.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.class_id ? `(${classes.find((c: any) => c.id === s.class_id)?.name || ''})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Judul Ujian</label><input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} placeholder="Contoh: Sumatif Akhir Semester" /></div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-3">
              <p className="text-xs font-extrabold text-indigo-900 uppercase tracking-wide flex items-center">
                <Calendar size={14} className="mr-1.5" /> Batasan Tanggal & Waktu Akses Siswa
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Jadwal Ujian</label>
                <input required type="date" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1"><label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label><input required type="time" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium" value={examForm.start_time} onChange={e => setExamForm({ ...examForm, start_time: e.target.value })} /></div>
                <div className="flex-1"><label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label><input required type="time" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium" value={examForm.end_time} onChange={e => setExamForm({ ...examForm, end_time: e.target.value })} /></div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Siswa hanya dapat login dan mengerjakan soal pada tanggal serta rentang jam mulai hingga jam selesai di atas.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1"><label className="block text-xs font-bold text-slate-700 mb-1">Token (6 Karakter)</label><input required maxLength={6} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase outline-none" value={examForm.token} onChange={e => setExamForm({ ...examForm, token: e.target.value.toUpperCase() })} placeholder="TOKEN" /></div>
              <div className="flex-1"><label className="block text-xs font-bold text-slate-700 mb-1">Durasi (Menit)</label><input required type="number" min={1} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={examForm.duration} onChange={e => setExamForm({ ...examForm, duration: Number(e.target.value) })} /></div>
            </div>
            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 mt-2 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Jadwal Ujian'}</button>
          </form>
        </Modal>

        <Modal title={`${questionForm.id ? 'Edit' : 'Tambah'} Soal`} isOpen={isQuestionModalOpen} onClose={() => setQuestionModalOpen(false)}>
          <form onSubmit={saveQuestion} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Tipe Soal</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold" value={questionForm.question_type} onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value as 'multiple_choice' | 'essay' })}>
                <option value="multiple_choice">Pilihan Ganda</option>
                <option value="essay">Esai / Uraian (atau Soal Import Word)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan / Teks Soal</label>
              <textarea required rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={questionForm.question_text} onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })} placeholder="Tuliskan soal di sini (Mendukung HTML untuk file dari word)..." />
            </div>
            {questionForm.question_type === 'multiple_choice' && (
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">Pilihan Jawaban & Kunci Jawaban Benar</label>
                {['A', 'B', 'C', 'D', 'E'].map((label, idx) => {
                  const optVal = questionForm.options[idx] || '';
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <input type="radio" name="correct_answer_radio" checked={optVal !== '' && questionForm.correct === optVal} onChange={() => setQuestionForm({ ...questionForm, correct: optVal })} title="Tandai sebagai jawaban benar" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 shrink-0" required={idx === 0} />
                      <span className="font-bold text-xs text-slate-500 w-5">{label}.</span>
                      <input required={idx < 4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500" value={optVal} onChange={(e) => { const updated = [...questionForm.options]; const wasCorrect = questionForm.correct === updated[idx]; updated[idx] = e.target.value; setQuestionForm({ ...questionForm, options: updated, correct: wasCorrect ? e.target.value : questionForm.correct }); }} placeholder={`Opsi ${label}`} />
                    </div>
                  );
                })}
                <p className="text-[11px] text-slate-500">Klik lingkaran di sebelah kiri opsi untuk memilih kunci jawaban yang benar.</p>
              </div>
            )}
            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Soal'}</button>
          </form>
        </Modal>

        {/* MODAL KOREKSI JAWABAN & INPUT NILAI SISWA */}
        <Modal
          title={`Koreksi Jawaban: ${gradingSession?.name || ''}`}
          isOpen={!!gradingSession}
          onClose={() => setGradingSession(null)}
        >
          {gradingSession && (() => {
            const detail = getSessionGradingDetail(gradingSession);
            let previewTotalWeight = 0;
            let previewEarnedWeight = 0;

            detail.pgQuestions.forEach((q) => {
              const w = Number(q.weight) || 1;
              previewTotalWeight += w;
              if (gradingSession.answers?.[q.id] === q.answer_key?.correct) previewEarnedWeight += w;
            });
            detail.essayQuestions.forEach((q) => {
              const w = Number(q.weight) || 5;
              previewTotalWeight += w;
              const val = Number(essayScoreInputs[q.id] || 0);
              previewEarnedWeight += (Math.min(100, Math.max(0, isNaN(val) ? 0 : val)) / 100) * w;
            });

            const previewFinalScore =
              previewTotalWeight > 0
                ? Math.round((previewEarnedWeight / previewTotalWeight) * 100)
                : Number(gradingSession.score || 0);

            return (
              <form onSubmit={saveGradingScores} className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <p className="font-extrabold text-slate-800">{gradingSession.name}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      NIS: {gradingSession.nis} • Kelas: {gradingSession.className}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Estimasi Nilai Akhir</span>
                    <span className="text-2xl font-extrabold text-emerald-600">{previewFinalScore}</span>
                  </div>
                </div>

                {/* Ringkasan Nilai Pilihan Ganda */}
                {detail.pgQuestions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-indigo-900 uppercase">Pilihan Ganda (Otomatis)</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Benar <strong>{detail.pgCorrectCount}</strong> dari <strong>{detail.pgQuestions.length}</strong> soal
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 font-extrabold text-indigo-700 text-sm">
                      Skor PG: {detail.pgScore}
                    </span>
                  </div>
                )}

                {/* Daftar Soal Esai untuk Dikoreksi */}
                {detail.essayQuestions.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                    Paket ujian ini hanya terdiri dari soal Pilihan Ganda. Nilai telah otomatis terhitung 100%.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Input Nilai Soal Esai / Uraian (Skala 0 – 100)
                    </p>
                    {detail.essayQuestions.map((eq, i) => {
                      const studentAns = gradingSession.answers?.[eq.id];
                      const currentVal = essayScoreInputs[eq.id] ?? '';
                      return (
                        <div key={eq.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                              Soal Esai #{i + 1}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">Bobot: {eq.weight || 5}</span>
                          </div>

                          <div
                            className="text-sm font-semibold text-slate-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: eq.question_text }}
                          />

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                              Jawaban Siswa:
                            </span>
                            {studentAns && String(studentAns).trim() !== '' ? (
                              <p className="text-sm text-slate-700 whitespace-pre-wrap font-medium">{studentAns}</p>
                            ) : (
                              <p className="text-xs italic text-red-500 font-medium">Siswa tidak mengisi jawaban.</p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1.5">
                              {[0, 50, 75, 85, 100].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() =>
                                    setEssayScoreInputs((prev) => ({ ...prev, [eq.id]: String(preset) }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                                    currentVal === String(preset)
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold text-slate-600">Nilai:</label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step="any"
                                placeholder="0-100"
                                className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-extrabold text-center text-slate-800 focus:border-emerald-500 outline-none"
                                value={currentVal}
                                onChange={(e) =>
                                  setEssayScoreInputs((prev) => ({ ...prev, [eq.id]: e.target.value }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGradingSession(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition disabled:opacity-60"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Nilai Koreksi'}
                  </button>
                </div>
              </form>
            );
          })()}
        </Modal>

        <Modal title="Peringatan Hapus Data" isOpen={!!adminConfirm} onClose={() => setAdminConfirm(null)}>
          <p className="mb-6 text-slate-700 font-medium leading-relaxed">{adminConfirm?.message}</p>
          <div className="flex gap-3 justify-end"><button onClick={() => setAdminConfirm(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition">Batal</button><button onClick={async () => { if (adminConfirm?.action) await adminConfirm.action(); setAdminConfirm(null); }} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md transition">Ya, Hapus</button></div>
        </Modal>

        <Modal title="Informasi" isOpen={!!adminAlert} onClose={() => setAdminAlert(null)}>
          <p className="mb-6 text-slate-700 font-medium leading-relaxed">{adminAlert}</p>
          <div className="flex justify-end"><button onClick={() => setAdminAlert(null)} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">Mengerti</button></div>
        </Modal>
      </main>
    </div>
  );
}