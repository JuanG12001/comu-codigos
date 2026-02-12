import { useState, useEffect } from "react";
import { Plus, Trash2, Zap, Hash, MessageSquare, User, Github, Heart, Copy, CheckSquare, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";

const Index = () => {
  interface Entry {
    id: string;
    user_name: string;
    code_1: string;
    code_2: string;
    code_3: string;
    is_used_1: boolean;
    is_used_2: boolean;
    is_used_3: boolean;
    message: string;
    created_at: string; // Supabase returns string
  }

  const [entries, setEntries] = useState<Entry[]>([]);
  const [nombre, setNombre] = useState("");
  const [codigo1, setCodigo1] = useState("");
  const [codigo2, setCodigo2] = useState("");
  const [codigo3, setCodigo3] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  // Initial Fetch & Filter by 5 minutes
  const fetchEntries = async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      let { data, error } = await supabase
        .from('community_codes')
        .select('*')
        .gt('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data as Entry[] || []);
    } catch (error) {
      console.error('Error fetching:', error);
      // Toast error removed to avoid spamming if network flickers
    } finally {
      setLoading(false);
    }
  };

  // Realtime Subscription and Periodic Cleanup
  useEffect(() => {
    fetchEntries();

    // 1. Subscribe to Realtime changes
    const channel = supabase
      .channel('realtime_codes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_codes' },
        (payload) => {
          console.log('Realtime change:', payload);
          fetchEntries(); // Refetch immediately on any change
        }
      )
      .subscribe();

    // 2. Auto-hide expired entries every 10 seconds (visual cleanup)
    const interval = setInterval(() => {
      setEntries(currentEntries => {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        return currentEntries.filter(entry => {
          const entryTime = new Date(entry.created_at).getTime();
          return entryTime > fiveMinutesAgo;
        });
      });
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || (!codigo1.trim() && !codigo2.trim() && !codigo3.trim()) || !mensaje.trim()) {
      toast.error("Completa el nombre, al menos un código y el mensaje");
      return;
    }

    try {
      const { error } = await supabase
        .from('community_codes')
        .insert([
          {
            user_name: nombre.trim(),
            code_1: codigo1.trim(),
            code_2: codigo2.trim(),
            code_3: codigo3.trim(),
            message: mensaje.trim(),
          },
        ]);

      if (error) throw error;

      toast.success("Entrada publicada en tiempo real");
      setNombre("");
      setCodigo1("");
      setCodigo2("");
      setCodigo3("");
      setMensaje("");
    } catch (error) {
      console.error('Error adding:', error);
      toast.error("Error al publicar");
    }
  };

  const toggleUsed = async (id: string, codeIndex: 1 | 2 | 3) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const fieldName = `is_used_${codeIndex}` as keyof Entry;
    const currentValue = entry[fieldName];

    try {
      const { error } = await supabase
        .from('community_codes')
        .update({ [fieldName]: !currentValue })
        .eq('id', id);

      if (error) throw error;
      // UI updates automatically via Realtime
    } catch (error) {
      console.error('Error updating:', error);
      toast.error("No se pudo actualizar el estado");
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  // Helper to render a single code row
  const renderCodeRow = (code: string, isUsed: boolean, entryId: string, index: 1 | 2 | 3, colorClass: string) => {
    if (!code) return null;

    return (
      <div className="flex items-center gap-3">
        {isUsed ? (
          <span className="bg-red-100 text-red-600 line-through px-3 py-1 rounded font-mono text-sm border border-red-200">
            {code} (USADO)
          </span>
        ) : (
          <>
            <span className={`${colorClass} px-3 py-1 rounded font-mono text-sm border bg-opacity-10 border-opacity-20`}>
              {code}
            </span>
            <button 
              onClick={() => copyToClipboard(code)} 
              title="Copiar"
              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleUsed(entryId, index)}
              className="flex items-center gap-1 text-xs border border-green-600/30 text-green-600 px-2 py-1 rounded hover:bg-green-50 transition-colors"
            >
              <CheckSquare className="h-3 w-3" />
              Marcar Usado
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Zap className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              CODIGOS SEEDANCE 2
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Comunidad de códigos por Juan García
            </p>
          </div>
          <span className="ml-auto text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></span>
            {entries.length} {entries.length === 1 ? "Activo" : "Activos"}
          </span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8 flex-grow">
        {/* Form */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Nombre (Max 10 letras)
                </label>
                <Input
                  placeholder="Tu nombre (ej: Juan)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  maxLength={10}
                  className="w-full bg-input/50 focus:bg-background transition-colors"
                />
              </div>

              {/* Códigos Grid */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Códigos de Referencia
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                     <span className="text-xs text-muted-foreground ml-1">Código #1</span>
                     <Input
                      placeholder="Ej: A123"
                      value={codigo1}
                      onChange={(e) => setCodigo1(e.target.value)}
                      className="bg-input/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                     <span className="text-xs text-muted-foreground ml-1">Código #2</span>
                     <Input
                      placeholder="Ej: B456"
                      value={codigo2}
                      onChange={(e) => setCodigo2(e.target.value)}
                      className="bg-input/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                     <span className="text-xs text-muted-foreground ml-1">Código #3</span>
                     <Input
                      placeholder="Ej: C789"
                      value={codigo3}
                      onChange={(e) => setCodigo3(e.target.value)}
                      className="bg-input/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Mensaje
                  </label>
                  <span className={`text-xs font-mono ${mensaje.length === 100 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                    {mensaje.length}/100
                  </span>
                </div>
                <Textarea
                  placeholder="Escribe tu mensaje o saludo aquí..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  maxLength={100}
                  rows={3}
                  className="bg-input/50 focus:bg-background transition-colors resize-none"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full font-semibold shadow-sm hover:shadow-md transition-all">
                <Plus className="h-5 w-5 mr-2" />
                {loading ? "Conectando..." : "Publicar Entrada"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Entries list */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
            Muro de la Comunidad
          </h2>

          {loading && entries.length === 0 ? (
             <div className="text-center py-10">
               <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full block mx-auto mb-2"></span>
               <p className="text-sm text-muted-foreground">Cargando códigos...</p>
             </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20 bg-card/50 rounded-xl border border-dashed border-border">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-base font-medium text-muted-foreground">¡Se el primero en compartir! (Visible por 5 min)</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {entries.map((entry) => (
                <Card
                  key={entry.id}
                  className="group overflow-hidden border border-border hover:shadow-md transition-all duration-300"
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                           <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold text-foreground text-sm">{entry.user_name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Codes Section */}
                    <div className="space-y-3 mb-4">
                      {renderCodeRow(entry.code_1, entry.is_used_1, entry.id, 1, "bg-blue-50 text-blue-700 border-blue-200")}
                      {renderCodeRow(entry.code_2, entry.is_used_2, entry.id, 2, "bg-purple-50 text-purple-700 border-purple-200")}
                      {renderCodeRow(entry.code_3, entry.is_used_3, entry.id, 3, "bg-emerald-50 text-emerald-700 border-emerald-200")}
                    </div>

                    {/* Footer: Message */}
                    <div className="pt-3 border-t border-border/50">
                       <p className="text-sm text-foreground/80 italic">
                          "{entry.message}"
                       </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t bg-card py-6 mt-auto">
        <div className="container max-w-4xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            Creado por Juan García <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          </span>
          <a href="https://github.com/JuanG12001" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            <Github className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
