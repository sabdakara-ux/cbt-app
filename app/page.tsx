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
  class_id?: string;
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

type QuestionType = 'multiple_choice' | 'complex_multiple_choice' | 'matching' | 'short_answer' | 'essay';

interface QuestionItem {
  id: string;
  examId?: string | null;
  subjectId: string;
  question_type: QuestionType;
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
// 3. MAIN APP COMPONENT
// ==========================================
const AUTH_STORAGE_KEY = 'cbt_persisted_auth_v2';

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
      setDbError('Konfigurasi Supabase belum ditemukan. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi.');
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

  // Realtime Subscription
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('realtime-exam-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'exam_sessions' },
        (payload) => {
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
                item.id === s.id
                  ? {
                      ...item,
                      status: s.status,
                      score: Number(s.score || 0),
                      violations: s.violations || 0,
                      answers: s.answers || {}
                    }
                  : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRow: any = payload.old;
            setExamSessions((prev) => prev.filter((item) => item.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-700 text-lg">Menghubungkan ke Server Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
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
          onStudentLogin={(sess: any) => {
            setSession(sess);
            setView('exam');
            persistAuth('exam', null, sess);
          }}
          onAdminLogin={() => {
            const adminUser = { role: 'admin' };
            setCurrentUser(adminUser);
            fetchAllData();
            setView('admin');
            persistAuth('admin', adminUser, null);
          }}
          onTeacherLogin={(teacher: any) => {
            const teacherUser = { role: 'teacher', ...teacher };
            setCurrentUser(teacherUser);
            fetchAllData();
            setView('admin');
            persistAuth('admin', teacherUser, null);
          }}
        />
      )}

      {view === 'exam' && (
        <ExamView
          session={session}
          onFinish={() => {
            setSession(null);
            fetchAllData();
            setView('login');
            persistAuth('login', null, null);
          }}
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
          onBack={() => {
            setCurrentUser(null);
            setView('login');
            persistAuth('login', null, null);
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// 4. LOGIN VIEW
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
        if (username === 'admin' && password === 'admin') {
          onAdminLogin();
        } else {
          setError('Username atau password admin salah!');
        }
      } else if (loginType === 'teacher') {
        const teacher = teachers.find((t: any) => t.username === username && t.password === password);
        if (teacher) {
          onTeacherLogin(teacher);
        } else {
          setError('Username atau password guru salah!');
        }
      } else {
        if (!supabase) {
          setError('Koneksi database belum siap.');
          setLoading(false);
          return;
        }

        const { data: examData, error: examErr } = await supabase
          .from('exams')
          .select('*')
          .eq('token', token.toUpperCase())
          .eq('is_active', true)
          .maybeSingle();

        if (examErr || !examData) {
          setError('Token ujian tidak valid atau ujian belum aktif!');
          setLoading(false);
          return;
        }

        // Validasi Tanggal dan Jam
        if (examData.exam_date && examData.start_time && examData.end_time) {
          const now = new Date();
          const offsetMs = now.getTimezoneOffset() * 60 * 1000;
          const localDate = new Date(now.getTime() - offsetMs);
          const currentStr = localDate.toISOString().split('T')[0];
          const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
          
          if (currentStr !== examData.exam_date || currentTime < examData.start_time.substring(0, 5) || currentTime > examData.end_time.substring(0, 5)) {
            setError(`Ujian hanya dapat diakses pada tanggal ${examData.exam_date} jam ${examData.start_time.substring(0, 5)} - ${examData.end_time.substring(0, 5)}`);
            setLoading(false);
            return;
          }
        }

        if (!nis.trim() || !name.trim()) {
          setError('NIS dan Nama wajib diisi!');
          setLoading(false);
          return;
        }

        const { data: existingSession } = await supabase
          .from('exam_sessions')
          .select('*')
          .eq('exam_id', examData.id)
          .eq('nis', nis.trim())
          .maybeSingle();

        if (existingSession && (existingSession.status === 'completed' || existingSession.status === 'locked')) {
          setError('Anda sudah menyelesaikan atau terkunci dari ujian ini!');
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

          if (insertErr || !newSession) {
            setError(`Gagal memulai sesi ujian: ${insertErr?.message}`);
            setLoading(false);
            return;
          }
          activeSessionId = newSession.id;
          startedAtMs = newSession.started_at ? new Date(newSession.started_at).getTime() : Date.now();
        }

        const endTime = startedAtMs + examData.duration_minutes * 60 * 1000;

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
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-blue-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 p-12 flex-col justify-between relative overflow-hidden text-white">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-white/30 overflow-hidden">
                {/* Ganti src dengan nama file logo Anda yang ada di folder public */}
                <img src="/logo-sekolah.png" alt="Logo" className="w-full h-full object-contain p-1" />
              </div>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">Sistem Ujian<br />SMKS ISLAM NURUL JADID</h1>
              <p className="text-indigo-100 text-lg">Masukan Nomer Peserta, Nama dan Token.</p>
            </div>
            <div className="relative z-10 bg-white/10 p-4 rounded-xl border border-white/20 mt-8 backdrop-blur-sm">
              <p className="text-sm font-bold mb-1 text-white">Tata Tertib Peserta Ujian:</p>
              <p className="text-xs text-indigo-100 leading-relaxed">Gunakan token resmi dari pengawas. Dilarang berpindah tab selama ujian.</p>
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

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all mt-4 disabled:opacity-70">
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
// 5. EXAM VIEW
// ==========================================
function ExamView({ session, onFinish }: any) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>(session.initialAnswers || {});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (session.endTime) {
      return Math.max(0, Math.floor((session.endTime - Date.now()) / 1000));
    }
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

      const { data: latestSession, error: sessErr } = await supabase
        .from('exam_sessions')
        .select('*')
        .eq('id', session.sessionId)
        .maybeSingle();

      if (sessErr || !latestSession || latestSession.status === 'completed' || latestSession.status === 'locked') {
        localStorage.removeItem(`cbt_ans_${session.sessionId}`);
        onFinish();
        return;
      }

      setViolations(latestSession.violations || 0);

      const { data, error } = await supabase
        .from('student_questions')
        .select('*')
        .eq('subject_id', session.subjectId)
        .order('order_num');

      if (!error && data) {
        const shuffled = shuffleArraySeeded(data, session.nis);
        setQuestions(shuffled);
      }

      const localAns = localStorage.getItem(`cbt_ans_${session.sessionId}`);
      const dbAns = latestSession.answers || {};
      if (localAns) {
        setAnswers({ ...dbAns, ...JSON.parse(localAns) });
      } else {
        setAnswers(dbAns);
      }
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
        const { data: qWithKeys } = await supabase
          .from('questions')
          .select('id, question_type, answer_key, weight')
          .eq('subject_id', session.subjectId);

        if (qWithKeys) {
          let correctPoints = 0;
          let totalAutoPoints = 0;

          qWithKeys.forEach((q: any) => {
             if (q.question_type === 'essay') return; 
             
             const weight = Number(q.weight || 1);
             totalAutoPoints += weight;
             let isCorrect = false;

             if (q.question_type === 'multiple_choice') {
                if (answers[q.id] === q.answer_key?.correct) isCorrect = true;
             } else if (q.question_type === 'complex_multiple_choice') {
                const userAns = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                const correctAns = Array.isArray(q.answer_key?.correct) ? q.answer_key.correct : [];
                if (userAns.length === correctAns.length && userAns.every((v: string) => correctAns.includes(v))) {
                    isCorrect = true;
                }
             } else if (q.question_type === 'short_answer') {
                if (String(answers[q.id] || '').trim().toLowerCase() === String(q.answer_key?.correct || '').trim().toLowerCase()) {
                    isCorrect = true;
                }
             } else if (q.question_type === 'matching') {
                const userAns = answers[q.id] || {};
                const correctAns = q.answer_key?.pairs || [];
                let allMatch = correctAns.length > 0;
                for (const pair of correctAns) {
                    if (userAns[pair.prompt] !== pair.target) {
                        allMatch = false; break;
                    }
                }
                if (allMatch) isCorrect = true;
             }

             if (isCorrect) correctPoints += weight;
          });

          score = totalAutoPoints > 0 ? Math.round((correctPoints / totalAutoPoints) * 100) : 0;
        }

        await supabase
          .from('exam_sessions')
          .update({
            answers,
            status: silent ? 'locked' : 'completed',
            score
          })
          .eq('id', session.sessionId);
      }

      if (!silent) {
        setAlertModal({
          title: 'Berhasil',
          message: 'Ujian Selesai. Seluruh jawaban Anda telah berhasil disinkronisasi ke server.',
          onClose: () => onFinish()
        });
      } else {
        onFinish();
      }
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
          setAlertModal({
            title: 'Ujian Terkunci',
            message: 'Ujian dikunci karena terlalu banyak pelanggaran (pindah tab).',
            onClose: () => submitExam(true)
          });
        } else {
          syncToSupabase(answers, newV);
          setAlertModal({ title: 'PELANGGARAN TERDETEKSI!', message: `Dilarang berpindah tab! Peringatan ke ${newV} dari 3.` });
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
    if (timeLeft <= 0) {
      submitExam();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, submitExam]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isLocked) {
        localStorage.setItem(`cbt_ans_${session.sessionId}`, JSON.stringify(answers));
        syncToSupabase(answers, violations);
      }
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

  if (loading) return <div className="p-10 text-center font-bold">Menyiapkan Soal dari Server...</div>;
  if (questions.length === 0) {
    return (
      <div className="p-10 text-center max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-md">
        <p className="text-red-500 font-bold mb-4">Belum ada soal untuk mata pelajaran ini.</p>
        <button onClick={onFinish} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl">Kembali</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const qTypeLabels = {
    multiple_choice: 'Pilihan Ganda',
    complex_multiple_choice: 'Pilihan Ganda Kompleks',
    matching: 'Menjodohkan',
    short_answer: 'Jawaban Singkat',
    essay: 'Esai / Uraian'
  };

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
          <button onClick={() => syncToSupabase(answers, violations)} className={`hidden md:flex text-xs px-3 py-1.5 rounded-full font-bold ${syncStatus === 'Tersimpan' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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
              <p className="font-medium text-slate-600">Akses ditutup. Batas pelanggaran tercapai atau ujian telah disubmit.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-md p-6 md:p-10 max-w-4xl mx-auto border border-slate-200/60">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
                <span className="font-extrabold text-lg bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-xl">Soal No. {currentIndex + 1}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">{(qTypeLabels as any)[currentQ.question_type]}</span>
              </div>

              <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: currentQ.question_text }} />

              <div className="mt-4">
                {currentQ.question_type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {(currentQ.payload?.options || []).map((opt: string, i: number) => (
                      <label key={i} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" name={`q_${currentQ.id}`} value={opt} checked={answers[currentQ.id] === opt} onChange={() => handleAnswerChange(currentQ.id, opt)} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-4 text-slate-700 font-medium text-lg">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {currentQ.question_type === 'complex_multiple_choice' && (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-500 mb-2">Pilih jawaban yang benar (Bisa lebih dari satu):</p>
                    {(currentQ.payload?.options || []).map((opt: string, i: number) => {
                      const currentAns = Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : [];
                      const isChecked = currentAns.includes(opt);
                      return (
                        <label key={i} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${isChecked ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input type="checkbox" checked={isChecked} onChange={(e) => {
                            const newAns = e.target.checked ? [...currentAns, opt] : currentAns.filter((x: string) => x !== opt);
                            handleAnswerChange(currentQ.id, newAns);
                          }} className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded" />
                          <span className="ml-4 text-slate-700 font-medium text-lg">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {currentQ.question_type === 'matching' && (
                  <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <p className="text-sm font-bold text-slate-500 mb-4">Pasangkan pernyataan di sebelah kiri dengan pilihan yang tepat di sebelah kanan:</p>
                    {(currentQ.payload?.prompts || []).map((prompt: string, i: number) => {
                      const currentAns = answers[currentQ.id] || {};
                      return (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                          <span className="font-semibold text-slate-700 flex-1">{prompt}</span>
                          <select 
                            className="p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none flex-1 max-w-xs font-medium"
                            value={currentAns[prompt] || ''}
                            onChange={(e) => handleAnswerChange(currentQ.id, { ...currentAns, [prompt]: e.target.value })}
                          >
                            <option value="" disabled>-- Pilih Pasangan --</option>
                            {(currentQ.payload?.targets || []).map((t: string, j: number) => (
                              <option key={j} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQ.question_type === 'short_answer' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Ketik jawaban singkat di sini..."
                      className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 text-lg font-medium outline-none transition shadow-sm"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                )}

                {currentQ.question_type === 'essay' && (
                  <div>
                    <textarea
                      placeholder="Tuliskan uraian jawaban Anda..."
                      rows={8}
                      autoComplete="off"
                      spellCheck="false"
                      className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 text-lg font-medium outline-none transition shadow-sm resize-y"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="mt-12 flex justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={() => { syncToSupabase(answers, violations); setCurrentIndex(Math.max(0, currentIndex - 1)); }}
                  disabled={currentIndex === 0}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 disabled:opacity-40"
                >Sebelumnya</button>
                {currentIndex === questions.length - 1 ? (
                  <button onClick={() => setConfirmModal(true)} className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg">Selesai Ujian</button>
                ) : (
                  <button
                    onClick={() => { syncToSupabase(answers, violations); setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1)); }}
                    className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg"
                  >Selanjutnya</button>
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
                let isAns = false;
                const a = answers[q.id];
                if (q.question_type === 'complex_multiple_choice') {
                   isAns = Array.isArray(a) && a.length > 0;
                } else if (q.question_type === 'matching') {
                   isAns = a && Object.keys(a).length > 0 && Object.values(a).some(v => v !== '');
                } else {
                   isAns = !!a && String(a).trim() !== '';
                }
                const isAct = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-12 rounded-xl font-bold text-base transition-all border-2
                      ${isAct ? 'ring-4 ring-indigo-100 border-indigo-500 scale-110 z-10' : ''}
                      ${isAns ? 'bg-indigo-600 text-white border-indigo-600' : !isAct ? 'bg-white text-slate-500 border-slate-200 hover:border-slate-300' : 'bg-white text-slate-800 border-indigo-500'}
                    `}
                  >{i + 1}</button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Modal title="Konfirmasi Selesai Ujian" isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
        <p className="mb-6 text-slate-700 font-medium">Apakah Anda yakin ingin mengakhiri ujian sekarang?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200">Batal</button>
          <button onClick={() => { setConfirmModal(false); submitExam(); }} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700">Ya, Akhiri</button>
        </div>
      </Modal>

      <Modal title={alertModal?.title || 'Informasi'} isOpen={!!alertModal} onClose={() => { const cb = alertModal?.onClose; setAlertModal(null); if (cb) cb(); }}>
        <p className="mb-6 text-slate-700 font-medium leading-relaxed">{alertModal?.message}</p>
        <div className="flex justify-end">
          <button onClick={() => { const cb = alertModal?.onClose; setAlertModal(null); if (cb) cb(); }} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700">Tutup</button>
        </div>
      </Modal>
    </div>
  );
}

// ==========================================
// 6. MODAL COMPONENT
// ==========================================
function Modal({ title, isOpen, onClose, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><XCircle size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ==========================================
// 7. ADMIN DASHBOARD
// ==========================================
function AdminDashboard({ currentUser, teachers, setTeachers, classes, setClasses, students, setStudents, subjects, setSubjects, exams, setExams, questions, setQuestions, examSessions, setExamSessions, onRefresh, onBack }: any) {
  const [activeTab, setActiveTab] = useState<'exams' | 'questions' | 'students' | 'classes' | 'teachers' | 'monitoring' | 'rekap'>(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('cbt_admin_tab_v2') as any;
      if (savedTab) return savedTab;
    }
    return 'monitoring';
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'teacher' && ['teachers', 'classes', 'students'].includes(activeTab)) setActiveTab('monitoring');
    else localStorage.setItem('cbt_admin_tab_v2', activeTab);
  }, [activeTab, currentUser?.role]);

  const [isTeacherModalOpen, setTeacherModalOpen] = useState(false);
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);

  const [classForm, setClassForm] = useState({ id: '', name: '' });
  const [studentForm, setStudentForm] = useState({ oldNis: '', nis: '', name: '', classId: '' });
  const [subjectForm, setSubjectForm] = useState({ id: '', class_id: '', code: '', name: '', grade: '' });
  const [teacherForm, setTeacherForm] = useState({ id: '', username: '', password: '', name: '', subjectIds: [] as string[] });
  const [examForm, setExamForm] = useState({ id: '', title: '', subjectId: '', token: '', duration: 90, date: '', start_time: '', end_time: '' });

  const [questionForm, setQuestionForm] = useState({
    id: '',
    question_type: 'multiple_choice' as QuestionType,
    question_text: '',
    options: ['', '', '', '', ''],
    correct: '',
    correctComplex: [] as string[],
    matchingPairs: [{ prompt: '', target: '' }] as { prompt: string, target: string }[],
    correctShort: ''
  });

  const [selectedBankClassId, setSelectedBankClassId] = useState('ALL');
  const visibleSubjects = currentUser.role === 'teacher' ? subjects.filter((s: any) => currentUser.subjectIds.includes(s.id)) : subjects;
  const filteredBankSubjects = selectedBankClassId === 'ALL' ? visibleSubjects : visibleSubjects.filter((s:any) => s.class_id === selectedBankClassId);

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  // useEffect untuk auto-select mapel Dihapus, agar pengguna melihat daftar kartu Mapel terlebih dahulu

  const visibleExamIds = exams.filter((e:any) => visibleSubjects.some((s:any) => s.id === e.subjectId)).map((e: any) => e.id);

  const [adminAlert, setAdminAlert] = useState<string | null>(null);
  const [adminConfirm, setAdminConfirm] = useState<{ message: string; action: () => Promise<void> | void } | null>(null);

  const handleImportExcelSiswa = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt: any) => {
      try {
        setSaving(true);
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

        const payloads = data.map((row: any) => {
          const cls = classes.find((c:any) => c.name === row['Kode Kelas']);
          return { nis: String(row['NIS']), name: row['Nama Lengkap'], class_id: cls?.id || null };
        });
        
        if (supabase) {
           await supabase.from('students').upsert(payloads, { onConflict: 'nis' });
           onRefresh();
           setAdminAlert('Berhasil import data siswa dari Excel.');
        }
      } catch (err: any) {
        setAdminAlert('Gagal memproses file Excel. Pastikan format kolom benar: NIS, Nama Lengkap, Kode Kelas.');
      }
      setSaving(false);
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const handleImportWordSoal = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !selectedSubjectId || !supabase) return;
    setSaving(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      const payloadData = {
        subject_id: selectedSubjectId,
        question_type: 'essay',
        question_text: result.value || 'Soal Kosong',
        weight: 5,
        order_num: questions.filter((q: any) => q.subjectId === selectedSubjectId).length + 1
      };
      
      await supabase.from('questions').insert(payloadData);
      onRefresh();
      setAdminAlert('Isi file Word berhasil diimpor sebagai 1 Soal Esai. Silakan edit jika ingin memecahnya.');
    } catch (err) {
      setAdminAlert('Gagal membaca file Word.');
    }
    setSaving(false);
    e.target.value = '';
  };

  const saveClass = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    if (classForm.id) {
      const { error } = await supabase.from('classes').update({ name: classForm.name }).eq('id', classForm.id);
      if (!error) onRefresh();
    } else {
      const { error } = await supabase.from('classes').insert({ name: classForm.name });
      if (!error) onRefresh();
    }
    setSaving(false); setClassModalOpen(false);
  };

  const saveStudent = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = { nis: studentForm.nis.trim(), name: studentForm.name.trim(), class_id: studentForm.classId || null };
    if (studentForm.oldNis) await supabase.from('students').update(payload).eq('nis', studentForm.oldNis);
    else await supabase.from('students').insert(payload);
    onRefresh(); setSaving(false); setStudentModalOpen(false);
  };

  const saveTeacher = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = { username: teacherForm.username.trim(), password: teacherForm.password, name: teacherForm.name.trim(), subject_ids: teacherForm.subjectIds };
    if (teacherForm.id) await supabase.from('teachers').update(payload).eq('id', teacherForm.id);
    else await supabase.from('teachers').insert(payload);
    onRefresh(); setSaving(false); setTeacherModalOpen(false);
  };

  const saveSubject = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = { class_id: subjectForm.class_id || null, code: subjectForm.code.trim().toUpperCase(), name: subjectForm.name.trim(), grade_level: subjectForm.grade };
    if (subjectForm.id) await supabase.from('subjects').update(payload).eq('id', subjectForm.id);
    else await supabase.from('subjects').insert(payload);
    onRefresh(); setSaving(false); setSubjectModalOpen(false);
  };

  const saveExam = async (e: any) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    const payload = { subject_id: examForm.subjectId, title: examForm.title.trim(), token: examForm.token.trim().toUpperCase(), duration_minutes: examForm.duration, exam_date: examForm.date || null, start_time: examForm.start_time || null, end_time: examForm.end_time || null, is_active: true };
    if (examForm.id) await supabase.from('exams').update(payload).eq('id', examForm.id);
    else await supabase.from('exams').insert(payload);
    onRefresh(); setSaving(false); setExamModalOpen(false);
  };

  const saveQuestion = async (e: any) => {
    e.preventDefault();
    if (!supabase || !selectedSubjectId) return;
    setSaving(true);

    let payloadJson = {};
    let answerKeyJson = {};

    if (questionForm.question_type === 'multiple_choice') {
        payloadJson = { options: questionForm.options.filter(Boolean) };
        answerKeyJson = { correct: questionForm.correct };
    } else if (questionForm.question_type === 'complex_multiple_choice') {
        payloadJson = { options: questionForm.options.filter(Boolean) };
        answerKeyJson = { correct: questionForm.correctComplex };
    } else if (questionForm.question_type === 'matching') {
        const validPairs = questionForm.matchingPairs.filter(p => p.prompt.trim() && p.target.trim());
        payloadJson = { prompts: validPairs.map(p => p.prompt), targets: validPairs.map(p => p.target) };
        answerKeyJson = { pairs: validPairs };
    } else if (questionForm.question_type === 'short_answer') {
        answerKeyJson = { correct: questionForm.correctShort };
    }

    const dbPayload = {
      subject_id: selectedSubjectId,
      question_type: questionForm.question_type,
      question_text: questionForm.question_text,
      payload: payloadJson,
      answer_key: answerKeyJson,
      weight: questionForm.question_type === 'essay' ? 5 : 1,
      order_num: questions.filter((q: any) => q.subjectId === selectedSubjectId).length + 1
    };

    if (questionForm.id) await supabase.from('questions').update(dbPayload).eq('id', questionForm.id);
    else await supabase.from('questions').insert(dbPayload);

    onRefresh();
    setSaving(false);
    setQuestionModalOpen(false);
  };

  const deleteFromSupabase = (tableName: string, setter: any, items: any[], idKey: string, idVal: string) => {
    setAdminConfirm({
      message: 'Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.',
      action: async () => {
        if (!supabase) return;
        await supabase.from(tableName).delete().eq(idKey, idVal);
        onRefresh();
      }
    });
  };

  const qTypeLabels = {
    multiple_choice: 'Pilihan Ganda',
    complex_multiple_choice: 'Pilihan Ganda Kompleks',
    matching: 'Menjodohkan',
    short_answer: 'Jawaban Singkat',
    essay: 'Esai / Uraian'
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-extrabold text-white flex items-center text-xl tracking-tight">
            {/* Ganti src dengan nama file logo Anda */}
            <img src="/logo-sekolah.png" alt="Logo" className="w-7 h-7 mr-3 object-contain" />
            {currentUser.role === 'admin' ? 'Admin Panel' : 'Panel Guru'}
          </h1>
          {currentUser.role === 'teacher' && <p className="text-xs text-slate-400 mt-2 font-medium">{currentUser.name}</p>}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Pelaksanaan & Hasil</p>
          <button onClick={() => setActiveTab('monitoring')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'monitoring' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800'}`}><Activity size={18} className="mr-3" /> Live Monitoring</button>
          <button onClick={() => setActiveTab('rekap')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'rekap' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800'}`}><Download size={18} className="mr-3" /> Rekap Nilai</button>

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-8 mb-2">Ujian & Soal</p>
          <button onClick={() => setActiveTab('exams')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800'}`}><FileText size={18} className="mr-3" /> Jadwal & Ujian</button>
          <button onClick={() => setActiveTab('questions')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'questions' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800'}`}><LayoutGrid size={18} className="mr-3" /> Bank Soal</button>

          {currentUser.role === 'admin' && (
            <>
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mt-8 mb-2">Master Data</p>
              <button onClick={() => setActiveTab('teachers')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'teachers' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Briefcase size={18} className="mr-3" /> Data Guru</button>
              <button onClick={() => setActiveTab('classes')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'classes' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><LayoutGrid size={18} className="mr-3" /> Data Kelas</button>
              <button onClick={() => setActiveTab('students')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center font-semibold ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Users size={18} className="mr-3" /> Data Siswa</button>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={onRefresh} className="w-full text-left px-4 py-2.5 rounded-xl flex items-center text-slate-400 hover:text-indigo-400 hover:bg-slate-800 font-semibold text-sm"><RefreshCw size={16} className="mr-3" /> Sinkronkan</button>
          <button onClick={() => { localStorage.removeItem('cbt_admin_tab_v2'); onBack(); }} className="w-full text-left px-4 py-3 rounded-xl flex items-center text-slate-400 hover:text-red-400 hover:bg-slate-800 font-bold"><LogOut size={18} className="mr-3" /> Keluar</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        
        {/* EXAMS */}
        {activeTab === 'exams' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-8">
              <div><h2 className="text-3xl font-extrabold text-slate-800">Jadwal & Ujian</h2></div>
              <button onClick={() => { setExamForm({ id: '', title: '', subjectId: visibleSubjects[0]?.id || '', token: '', duration: 90, date: '', start_time: '', end_time: '' }); setExamModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center"><PlusCircle size={18} className="mr-2" /> Buat Ujian</button>
            </div>
            <div className="grid gap-4">
              {exams.filter((e:any) => visibleSubjects.some((s:any)=>s.id === e.subjectId)).map((ex: any) => {
                const sub = subjects.find((s: any) => s.id === ex.subjectId);
                return (
                  <div key={ex.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-between items-center hover:shadow-md">
                    <div>
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg uppercase mb-2 inline-block">{sub?.name}</span>
                      <h3 className="font-extrabold text-xl text-slate-800">{ex.title}</h3>
                      <p className="text-slate-500 font-medium mt-1">Jadwal: <strong>{ex.date} ({ex.start_time} - {ex.end_time})</strong> • Token: <strong className="font-mono text-indigo-600 bg-indigo-50 px-2">{ex.token}</strong> • {ex.duration_minutes} Menit</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setExamForm({ id: ex.id, title: ex.title, subjectId: ex.subjectId, token: ex.token, duration: ex.duration_minutes, date: ex.date, start_time: ex.start_time, end_time: ex.end_time }); setExamModalOpen(true); }} className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl"><Edit size={18} /></button>
                      <button onClick={() => deleteFromSupabase('exams', setExams, exams, 'id', ex.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <div><h2 className="text-3xl font-extrabold text-slate-800">Bank Soal</h2></div>
              <div className="flex gap-2">
                {currentUser.role === 'admin' && <button onClick={() => { setSubjectForm({ id: '', class_id: selectedBankClassId !== 'ALL' ? selectedBankClassId : '', code: '', name: '', grade: '' }); setSubjectModalOpen(true); }} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md flex items-center transition"><PlusCircle size={18} className="mr-2" /> Tambah Mapel</button>}
              </div>
            </div>

            {!selectedSubjectId ? (
              <>
                {/* TABS KELAS */}
                <div className="flex overflow-x-auto gap-2 mb-6 hide-scrollbar pb-2">
                  <button onClick={() => setSelectedBankClassId('ALL')} className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedBankClassId === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>Semua Kelas</button>
                  {classes.map((c: any) => (
                    <button key={c.id} onClick={() => setSelectedBankClassId(c.id)} className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedBankClassId === c.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{c.name}</button>
                  ))}
                </div>

                {/* MAPEL CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBankSubjects.length === 0 ? (
                    <div className="col-span-full p-10 text-center bg-white border border-dashed border-slate-300 rounded-3xl text-slate-500 font-medium">Belum ada mata pelajaran untuk kelas ini.</div>
                  ) : (
                    filteredBankSubjects.map((sub: any) => (
                      <div key={sub.id} onClick={() => setSelectedSubjectId(sub.id)} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition cursor-pointer group">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                             <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg uppercase inline-block">{sub.code}</span>
                             {currentUser.role === 'admin' && (
                                <button onClick={(e) => { e.stopPropagation(); setSubjectForm({ id: sub.id, class_id: sub.class_id || '', code: sub.code, name: sub.name, grade: sub.grade_level || '' }); setSubjectModalOpen(true); }} className="p-2 text-slate-400 hover:text-amber-500 bg-slate-50 hover:bg-amber-50 rounded-lg transition"><Edit size={16} /></button>
                             )}
                          </div>
                          <h3 className="font-extrabold text-xl text-slate-800 group-hover:text-indigo-600 transition">{sub.name}</h3>
                          <div className="mt-4 flex items-center text-sm font-bold text-slate-500">
                             <LayoutGrid size={16} className="mr-2 text-slate-400" />
                             {questions.filter((q:any) => q.subjectId === sub.id).length} Butir Soal
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <button onClick={() => setSelectedSubjectId('')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm flex items-center">
                    ← Kembali ke Daftar Mapel
                  </button>
                  <div className="font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    {subjects.find((s:any) => s.id === selectedSubjectId)?.name}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Daftar Soal ({questions.filter((q:any)=>q.subjectId === selectedSubjectId).length})</span>
                    <div className="flex gap-2">
                      <label className="text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer flex items-center transition shadow-sm">
                        Import Word (.docx) <input type="file" accept=".docx" className="hidden" onChange={handleImportWordSoal} />
                      </label>
                      <button onClick={() => { setQuestionForm({ id: '', question_type: 'multiple_choice', question_text: '', options: ['','','','',''], correct: '', correctComplex: [], matchingPairs: [{prompt:'', target:''}], correctShort: '' }); setQuestionModalOpen(true); }} className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center transition shadow-sm"><PlusCircle size={16} className="mr-1.5" /> Tambah Soal</button>
                    </div>
                  </div>
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white border-b border-slate-100">
                      <tr><th className="px-6 py-4 font-bold w-12">No</th><th className="px-6 py-4 font-bold">Pertanyaan</th><th className="px-6 py-4 font-bold">Tipe</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {questions.filter((q:any)=>q.subjectId === selectedSubjectId).length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada soal pada mapel ini.</td></tr>
                      ) : (
                        questions.filter((q:any)=>q.subjectId === selectedSubjectId).map((q: any, idx: number) => (
                          <tr key={q.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold">{idx + 1}</td>
                            <td className="px-6 py-4">
                              <div className="line-clamp-2 font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: q.question_text }}></div>
                            </td>
                            <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">{(qTypeLabels as any)[q.question_type]}</span></td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex gap-1 justify-center">
                                <button onClick={() => {
                                  const opts = q.payload?.options || [];
                                  const pairs = q.answer_key?.pairs || [{prompt:'', target:''}];
                                  setQuestionForm({
                                    id: q.id, question_type: q.question_type, question_text: q.question_text,
                                    options: [opts[0]||'', opts[1]||'', opts[2]||'', opts[3]||'', opts[4]||''],
                                    correct: q.answer_key?.correct && typeof q.answer_key.correct === 'string' ? q.answer_key.correct : '',
                                    correctComplex: Array.isArray(q.answer_key?.correct) ? q.answer_key.correct : [],
                                    matchingPairs: pairs,
                                    correctShort: q.question_type === 'short_answer' ? q.answer_key?.correct || '' : ''
                                  });
                                  setQuestionModalOpen(true);
                                }} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition"><Edit size={16} /></button>
                                <button onClick={() => deleteFromSupabase('questions', setQuestions, questions, 'id', q.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* STUDENTS */}
        {activeTab === 'students' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <div><h2 className="text-3xl font-extrabold text-slate-800">Data Siswa</h2></div>
              <div className="flex gap-2">
                <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none" value={selectedBankClassId} onChange={(e) => setSelectedBankClassId(e.target.value)}>
                  <option value="ALL">Semua Kelas</option>
                  {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center cursor-pointer">
                  Import Excel <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcelSiswa} />
                </label>
                <button onClick={() => { setStudentForm({ oldNis: '', nis: '', name: '', classId: '' }); setStudentModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"><PlusCircle size={18} className="inline mr-2" />Tambah Siswa</button>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold">NIS</th><th className="px-6 py-4 font-bold">Nama Lengkap</th><th className="px-6 py-4 font-bold">Kelas</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.filter((s:any) => selectedBankClassId === 'ALL' || s.classId === selectedBankClassId).map((s: any) => (
                    <tr key={s.nis} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">{s.nis}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                      <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-bold text-xs">{s.className}</span></td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => { setStudentForm({ oldNis: s.nis, nis: s.nis, name: s.name, classId: s.classId }); setStudentModalOpen(true); }} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => deleteFromSupabase('students', setStudents, students, 'nis', s.nis)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OTHER TABS (Classes, Teachers, Monitoring, Rekap - Simplified for brevity but intact logic) */}
        {activeTab === 'classes' && currentUser.role === 'admin' && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-extrabold text-slate-800">Data Kelas</h2>
              <button onClick={() => { setClassForm({ id: '', name: '' }); setClassModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Tambah Kelas</button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold">Nama Kelas</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => { setClassForm({ id: c.id, name: c.name }); setClassModalOpen(true); }} className="p-1.5 text-amber-500"><Edit size={16} /></button>
                        <button onClick={() => deleteFromSupabase('classes', setClasses, classes, 'id', c.id)} className="p-1.5 text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && currentUser.role === 'admin' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-extrabold text-slate-800">Data Guru</h2>
              <button onClick={() => { setTeacherForm({ id: '', username: '', password: '', name: '', subjectIds: [] }); setTeacherModalOpen(true); }} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Tambah Guru</button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-4 font-bold">Nama</th><th className="px-6 py-4 font-bold">Username</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">{t.name}</td><td className="px-6 py-4 font-mono">{t.username}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => { setTeacherForm({ id: t.id, username: t.username, password: t.password, name: t.name, subjectIds: t.subjectIds }); setTeacherModalOpen(true); }} className="p-1.5 text-amber-500"><Edit size={16} /></button>
                        <button onClick={() => deleteFromSupabase('teachers', setTeachers, teachers, 'id', t.id)} className="p-1.5 text-red-500"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Live Monitoring <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full animate-pulse">Realtime</span></h2>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-4 font-bold">Peserta</th><th className="px-6 py-4 font-bold text-center">Status</th><th className="px-6 py-4 font-bold text-center">Nilai PG</th><th className="px-6 py-4 font-bold text-center">Aksi</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {examSessions.filter((s:any) => visibleExamIds.includes(s.examId)).map((sess: any) => (
                    <tr key={sess.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4"><div className="font-bold text-slate-800">{sess.name}</div><div className="text-xs text-slate-500">{sess.nis}</div></td>
                      <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-lg font-bold text-xs uppercase ${sess.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{sess.status}</span></td>
                      <td className="px-6 py-4 text-center font-extrabold text-lg">{sess.score ?? '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => { setAdminConfirm({ message: 'Reset sesi ini?', action: async () => { if (supabase) { await supabase.from('exam_sessions').delete().eq('id', sess.id); onRefresh(); } } }); }} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg text-xs font-bold mx-auto">Reset Login</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rekap' && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-extrabold text-slate-800">Rekap Hasil Ujian</h2>
              <button onClick={() => {
                const headers = 'NIS,Nama Siswa,Kelas,Ujian,Nilai\n';
                const rows = examSessions.filter((s:any) => s.status === 'completed' && visibleExamIds.includes(s.examId)).map((s:any) => `${s.nis},"${s.name}","${s.className}","${exams.find((e:any)=>e.id === s.examId)?.title || '-'}",${s.score}`).join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'rekap_nilai.csv'; link.click();
              }} className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md flex"><Download size={18} className="mr-2" /> Unduh CSV</button>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH / EDIT SOAL (DENGAN 5 TIPE SOAL) */}
        <Modal title={`${questionForm.id ? 'Edit' : 'Tambah'} Soal`} isOpen={isQuestionModalOpen} onClose={() => setQuestionModalOpen(false)}>
          <form onSubmit={saveQuestion} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Soal</label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
                value={questionForm.question_type}
                onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value as QuestionType })}
              >
                {Object.entries(qTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan / Teks Soal</label>
              <textarea required rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={questionForm.question_text} onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })} placeholder="Mendukung format HTML atau teks biasa..." />
            </div>

            {questionForm.question_type === 'multiple_choice' && (
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">Pilihan & Kunci (Pilih Satu)</label>
                {['A', 'B', 'C', 'D', 'E'].map((label, idx) => {
                  const optVal = questionForm.options[idx] || '';
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <input type="radio" name="correct_radio" checked={optVal !== '' && questionForm.correct === optVal} onChange={() => setQuestionForm({ ...questionForm, correct: optVal })} className="w-4 h-4 text-emerald-600" required={idx === 0} />
                      <span className="font-bold text-xs text-slate-500 w-5">{label}.</span>
                      <input required={idx < 4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={optVal} onChange={(e) => { const updated = [...questionForm.options]; const wasCorrect = questionForm.correct === updated[idx]; updated[idx] = e.target.value; setQuestionForm({ ...questionForm, options: updated, correct: wasCorrect ? e.target.value : questionForm.correct }); }} placeholder={`Opsi ${label}`} />
                    </div>
                  );
                })}
              </div>
            )}

            {questionForm.question_type === 'complex_multiple_choice' && (
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">Pilihan & Kunci (Centang yang Benar)</label>
                {['A', 'B', 'C', 'D', 'E'].map((label, idx) => {
                  const optVal = questionForm.options[idx] || '';
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <input type="checkbox" checked={optVal !== '' && questionForm.correctComplex.includes(optVal)} onChange={(e) => {
                        const newCorrect = e.target.checked ? [...questionForm.correctComplex, optVal] : questionForm.correctComplex.filter(v => v !== optVal);
                        setQuestionForm({ ...questionForm, correctComplex: newCorrect });
                      }} className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="font-bold text-xs text-slate-500 w-5">{label}.</span>
                      <input required={idx < 4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={optVal} onChange={(e) => {
                        const updated = [...questionForm.options];
                        const oldVal = updated[idx];
                        updated[idx] = e.target.value;
                        const updatedComplex = questionForm.correctComplex.map(v => v === oldVal ? e.target.value : v);
                        setQuestionForm({ ...questionForm, options: updated, correctComplex: updatedComplex });
                      }} placeholder={`Opsi ${label}`} />
                    </div>
                  );
                })}
              </div>
            )}

            {questionForm.question_type === 'matching' && (
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700 flex justify-between items-center">
                  Pasangan (Kiri & Kanan)
                  <button type="button" onClick={() => setQuestionForm({...questionForm, matchingPairs: [...questionForm.matchingPairs, {prompt:'', target:''}]})} className="text-indigo-600 text-xs">+ Tambah Baris</button>
                </label>
                {questionForm.matchingPairs.map((pair, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={pair.prompt} onChange={(e) => {
                      const newPairs = [...questionForm.matchingPairs]; newPairs[idx].prompt = e.target.value; setQuestionForm({...questionForm, matchingPairs: newPairs});
                    }} placeholder="Pernyataan (Kiri)" />
                    <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={pair.target} onChange={(e) => {
                      const newPairs = [...questionForm.matchingPairs]; newPairs[idx].target = e.target.value; setQuestionForm({...questionForm, matchingPairs: newPairs});
                    }} placeholder="Jawaban (Kanan)" />
                    <button type="button" onClick={() => setQuestionForm({...questionForm, matchingPairs: questionForm.matchingPairs.filter((_, i) => i !== idx)})} className="text-red-500 px-2"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            )}

            {questionForm.question_type === 'short_answer' && (
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">Kunci Jawaban Tepat</label>
                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" value={questionForm.correctShort} onChange={(e) => setQuestionForm({ ...questionForm, correctShort: e.target.value })} placeholder="Ketik kata kunci atau teks..." />
              </div>
            )}

            <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 mt-4">
              {saving ? 'Menyimpan...' : 'Simpan Soal'}
            </button>
          </form>
        </Modal>

        {/* REUSABLE MODALS FOR OTHERS */}
        <Modal title="Peringatan Hapus Data" isOpen={!!adminConfirm} onClose={() => setAdminConfirm(null)}>
          <p className="mb-6 text-slate-700 font-medium">{adminConfirm?.message}</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setAdminConfirm(null)} className="px-5 py-2.5 bg-slate-100 rounded-xl font-bold">Batal</button>
            <button onClick={async () => { if (adminConfirm?.action) await adminConfirm.action(); setAdminConfirm(null); }} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold">Ya, Hapus</button>
          </div>
        </Modal>

        <Modal title="Informasi" isOpen={!!adminAlert} onClose={() => setAdminAlert(null)}>
          <p className="mb-6 text-slate-700 font-medium">{adminAlert}</p>
          <div className="flex justify-end"><button onClick={() => setAdminAlert(null)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">Mengerti</button></div>
        </Modal>

        {/* MODAL KELAS, GURU, MAPEL DLL */}
        <Modal title="Form Kelas" isOpen={isClassModalOpen} onClose={() => setClassModalOpen(false)}>
           <form onSubmit={saveClass}><input required className="w-full p-3 border rounded-xl mb-4" value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} placeholder="Nama Kelas" /><button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan</button></form>
        </Modal>
        
        <Modal title="Form Mapel" isOpen={isSubjectModalOpen} onClose={() => setSubjectModalOpen(false)}>
           <form onSubmit={saveSubject}>
             <select className="w-full p-3 border rounded-xl mb-4" value={subjectForm.class_id} onChange={e=>setSubjectForm({...subjectForm, class_id: e.target.value})}><option value="">-- Pilih Kelas Terkait (Opsional) --</option>{classes.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
             <input required className="w-full p-3 border rounded-xl mb-4" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} placeholder="Kode" />
             <input required className="w-full p-3 border rounded-xl mb-4" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} placeholder="Nama Mapel" />
             <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan</button>
           </form>
        </Modal>
        
        <Modal title="Form Jadwal" isOpen={isExamModalOpen} onClose={() => setExamModalOpen(false)}>
           <form onSubmit={saveExam} className="space-y-4">
             <select required className="w-full p-3 border rounded-xl" value={examForm.subjectId} onChange={e => setExamForm({ ...examForm, subjectId: e.target.value })}><option value="">-- Pilih Mapel --</option>{visibleSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
             <input required className="w-full p-3 border rounded-xl" value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} placeholder="Judul Ujian" />
             <input required type="date" className="w-full p-3 border rounded-xl" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} />
             <div className="flex gap-2">
               <input required type="time" className="w-full p-3 border rounded-xl" value={examForm.start_time} onChange={e => setExamForm({ ...examForm, start_time: e.target.value })} />
               <input required type="time" className="w-full p-3 border rounded-xl" value={examForm.end_time} onChange={e => setExamForm({ ...examForm, end_time: e.target.value })} />
             </div>
             <div className="flex gap-2">
               <input required maxLength={6} className="w-full p-3 border rounded-xl font-mono uppercase" value={examForm.token} onChange={e => setExamForm({ ...examForm, token: e.target.value.toUpperCase() })} placeholder="TOKEN" />
               <input required type="number" min={1} className="w-full p-3 border rounded-xl" value={examForm.duration} onChange={e => setExamForm({ ...examForm, duration: Number(e.target.value) })} placeholder="Durasi (Menit)" />
             </div>
             <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan Jadwal</button>
           </form>
        </Modal>
        
        <Modal title="Form Siswa" isOpen={isStudentModalOpen} onClose={() => setStudentModalOpen(false)}>
           <form onSubmit={saveStudent} className="space-y-4">
             <input required className="w-full p-3 border rounded-xl" value={studentForm.nis} onChange={e => setStudentForm({ ...studentForm, nis: e.target.value })} placeholder="NIS" />
             <input required className="w-full p-3 border rounded-xl" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="Nama Lengkap" />
             <select required className="w-full p-3 border rounded-xl" value={studentForm.classId} onChange={e => setStudentForm({ ...studentForm, classId: e.target.value })}><option value="">-- Pilih Kelas --</option>{classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
             <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan Siswa</button>
           </form>
        </Modal>
        
        <Modal title="Form Guru" isOpen={isTeacherModalOpen} onClose={() => setTeacherModalOpen(false)}>
           <form onSubmit={saveTeacher} className="space-y-4">
             <input required className="w-full p-3 border rounded-xl" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} placeholder="Nama Lengkap" />
             <input required className="w-full p-3 border rounded-xl" value={teacherForm.username} onChange={e => setTeacherForm({ ...teacherForm, username: e.target.value })} placeholder="Username" />
             <input required className="w-full p-3 border rounded-xl" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} placeholder="Password" />
             <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                {subjects.map((s: any) => (
                  <label key={s.id} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={teacherForm.subjectIds.includes(s.id)} onChange={(e) => setTeacherForm({ ...teacherForm, subjectIds: e.target.checked ? [...teacherForm.subjectIds, s.id] : teacherForm.subjectIds.filter((id) => id !== s.id) })} className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold">{s.name}</span>
                  </label>
                ))}
             </div>
             <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan Guru</button>
           </form>
        </Modal>

      </main>
    </div>
  );
}