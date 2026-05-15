import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);

  useEffect(() => {
    checkSession();
    loadData();
  }, []);

  const checkSession = () => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
    }
    setLoading(false);
  };

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('nail_data')
        .select('content')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      const loaded = JSON.parse(data.content);
      console.log('📊 Datos cargados:', {
        servicios: loaded.services?.length,
        clientes: loaded.clients?.length,
        citas: loaded.appointments?.length,
        productos: loaded.products?.length
      });
      setDb(loaded);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const login = async (username, password) => {
    if (!db) await loadData();
    
    const userFound = db?.users?.find(
      u => u.username === username && u.password === password
    );
    
    if (userFound) {
      localStorage.setItem('user', JSON.stringify(userFound));
      localStorage.setItem('role', userFound.role);
      setUser(userFound);
      setRole(userFound.role);
      return { success: true, role: userFound.role };
    }
    
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, db, loadData }}>
      {children}
    </AuthContext.Provider>
  );
};