import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { Auth } from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import { Button } from './components/ui/Button';
import { useStore } from './lib/store';
import { supabase } from './lib/supabase';

function App() {
  const { user, setUser } = useStore();

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser(data);
          });
      }
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(data);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">NeuroShift</span>
                </div>
              </div>
              {user && (
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Auth />
                )
              }
            />
            <Route
              path="/onboarding"
              element={
                !user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Onboarding />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                !user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Dashboard />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;