import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registra os componentes do gráfico
ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  // --- ESTADOS (Inputs) ---
  const [liderName, setLiderName] = useState('');
  const [rede, setRede] = useState('');
  const [episodio, setEpisodio] = useState('');
  
  const [inicios, setInicios] = useState(0);
  const [inativas, setInativas] = useState(0);
  const [cadastros, setCadastros] = useState(0);
  const [ativas, setAtivas] = useState(0);
  const [iniciosCompletos, setIniciosCompletos] = useState(0);

  const [valTabela1, setValTabela1] = useState(0);
  const [valTabela2, setValTabela2] = useState(0);
  const [valTarget, setValTarget] = useState(0);
  const [valEstrela, setValEstrela] = useState(0);

  // --- CÁLCULOS AUTOMÁTICOS ---
  const percentualAtividade = useMemo(() => {
    return cadastros > 0 ? ((ativas / cadastros) * 100).toFixed(1) : '0.0';
  }, [ativas, cadastros]);

  const saldo = inicios - inativas;
  const valIniciosCompletos = iniciosCompletos * 50; // R$ 50 por início completo
  const totalReceber = valTabela1 + valTabela2 + valIniciosCompletos + valTarget + valEstrela;

  // Formatador de Moeda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Lógica do Gráfico
  const chartData = {
    labels: ['Tab 1', 'Tab 2', 'Inícios', 'Bônus'],
    datasets: [
      {
        data: [valTabela1, valTabela2, valIniciosCompletos, valTarget + valEstrela],
        backgroundColor: ['#1e3a8a', '#d97706', '#10b981', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'bottom' }
    },
    cutout: '75%',
    maintainAspectRatio: false
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
      
      {/* Navbar */}
      <nav className="bg-gradient-to-br from-blue-900 to-blue-950 text-white shadow-lg sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-xl font-bold tracking-wide">REGIONAL RJ2</h1>
              <p className="text-xs text-blue-200">Gestão de Performance</p>
            </div>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center"
          >
            📄 GERAR PDF
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        
        {/* Título (Escondido na impressão) */}
        <div className="mb-8 text-center max-w-3xl mx-auto print:hidden">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Painel de Geração de Extrato</h2>
          <p className="text-slate-600">Preencha os dados abaixo para gerar o extrato automático.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
          {/* COLUNA ESQUERDA: INPUTS (Não aparece na impressão) */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            
            {/* Bloco 1: Cadastro */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
              <h3 className="text-lg font-bold mb-4 flex items-center">👤 Cadastro</h3>
              <div className="space-y-3">
                <InputGroup label="Nome do(a) Líder" value={liderName} onChange={setLiderName} type="text" placeholder="Nome Completo" />
                <InputGroup label="Rede" value={rede} onChange={setRede} type="text" placeholder="Identificação da Rede" />
                <InputGroup label="Episódio Atual" value={episodio} onChange={setEpisodio} type="text" placeholder="Ex: 01/2024" />
              </div>
            </div>

            {/* Bloco 2: Performance */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-amber-500">
              <h3 className="text-lg font-bold mb-4 flex items-center">📊 Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <InputGroup label="Inícios" value={inicios} onChange={setInicios} type="number" />
                <InputGroup label="Inativas i6" value={inativas} onChange={setInativas} type="number" />
                <InputGroup label="Cadastro Total" value={cadastros} onChange={setCadastros} type="number" />
                <InputGroup label="Ativas Real" value={ativas} onChange={setAtivas} type="number" />
                <div className="col-span-2">
                  <InputGroup label="Inícios Completos (Qtd)" value={iniciosCompletos} onChange={setIniciosCompletos} type="number" />
                </div>
              </div>
            </div>

            {/* Bloco 3: Ganhos */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
              <h3 className="text-lg font-bold mb-4 flex items-center">💸 Valores (R$)</h3>
              <div className="space-y-3">
                <InputGroup label="Tabela 1 (Ativas - Inícios)" value={valTabela1} onChange={setValTabela1} type="number" step="0.01" />
                <InputGroup label="Tabela 2 (% Receita)" value={valTabela2} onChange={setValTabela2} type="number" step="0.01" />
                <InputGroup label="Bônus Target Ativos" value={valTarget} onChange={setValTarget} type="number" step="0.01" />
                <InputGroup label="Bônus Target Estrela" value={valEstrela} onChange={setValEstrela} type="number" step="0.01" />
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA: DASHBOARD (O que será impresso) */}
          <div className="lg:col-span-8 print:col-span-12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 print:shadow-none print:border-none">
                
              {/* Cabeçalho do Extrato */}
              <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-center border-b-4 border-amber-500 print:bg-slate-900 print:text-white">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{liderName || 'Nome do(a) Líder'}</h2>
                  <p className="text-amber-400 font-semibold">Rede: {rede || '---'}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-sm opacity-80 font-bold uppercase">Extrato de Ganhos</div>
                  <div className="text-xl font-extrabold text-amber-500">Episódio {episodio || '---'}</div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">

                {/* Cards de Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <MetricCard label="Inícios" value={inicios} color="blue" icon="🚀" />
                  <MetricCard label="Inativas i6" value={inativas} color="red" icon="⚠️" />
                  <MetricCard label="Cadastro" value={cadastros} color="slate" icon="📋" />
                  <MetricCard label="Ativas" value={ativas} color="emerald" icon="✅" />
                  
                  {/* Card Saldo com Cor Dinâmica */}
                  <div className={`p-3 rounded-lg text-center border ${saldo >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="text-[10px] font-bold uppercase mb-1 flex items-center justify-center">
                      <span className="mr-1">⚖️</span> Saldo
                    </div>
                    <div className="text-lg font-extrabold">{saldo}</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  
                  {/* Lista de Detalhes */}
                  <div className="flex-1 space-y-4">
                    <SectionTitle icon="📊" title="Indicadores de Performance" />
                    
                    <RowItem label="% de Atividade:" value={`${percentualAtividade}%`} valueClass="text-blue-700 text-lg" />
                    <RowItem label="Inícios Completos:" value={iniciosCompletos} />

                    <div className="pt-4">
                      <SectionTitle icon="💰" title="Ganhos do Episódio" />
                    </div>

                    <RowItem label="Tabela 1 (Liderança)" value={formatCurrency(valTabela1)} />
                    <RowItem label="Tabela 2 (% Receita)" value={formatCurrency(valTabela2)} />
                    <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded px-3 border border-green-100 print:bg-green-50">
                      <span className="text-green-800 font-semibold">Inícios Completos (Bônus)</span>
                      <span className="font-bold text-green-800">{formatCurrency(valIniciosCompletos)}</span>
                    </div>
                    <RowItem label="Bônus Target Ativos" value={formatCurrency(valTarget)} />
                    <RowItem label="Bônus Target Estrela" value={formatCurrency(valEstrela)} />
                  </div>

                  {/* Coluna Visual e Gráfico */}
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100 print:bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase">Visão de Ganhos</h4>
                    <div className="w-full max-w-[250px] h-[250px]">
                      {/* Gráfico Doughnut */}
                      <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    
                    {/* Badges de Conquista */}
                    <div className="mt-6 w-full space-y-2">
                        {inicios >= 10 ? (
                            <>
                                <div className="bg-purple-600 text-white p-3 rounded-xl text-[11px] font-extrabold text-center shadow-md print:bg-purple-600 print:text-white">
                                    👑 KIT LÍDER MASTER (10+ Inícios)
                                </div>
                                <div className="bg-amber-100 text-amber-800 p-1 rounded-full text-[10px] font-bold text-center print:bg-amber-100">Conquistado!</div>
                            </>
                        ) : inicios >= 5 ? (
                            <>
                                <div className="bg-amber-500 text-white p-3 rounded-xl text-[11px] font-extrabold text-center shadow-md print:bg-amber-500 print:text-white">
                                    🎁 KIT PRÊMIO LÍDER (5-9 Inícios)
                                </div>
                                <div className="bg-amber-100 text-amber-800 p-1 rounded-full text-[10px] font-bold text-center print:bg-amber-100">Conquistado!</div>
                            </>
                        ) : (
                            <div className="bg-slate-200 text-slate-400 p-3 rounded-xl text-[10px] font-bold text-center italic border border-slate-300">
                                Nenhum Kit Conquistado
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Banner Total */}
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-6 rounded-xl shadow-lg text-white flex flex-col md:flex-row justify-between items-center print:bg-amber-500 print:text-white">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className="text-3xl mr-3">💎</span>
                    <div>
                      <p className="text-amber-100 text-sm font-semibold uppercase tracking-wider">Valor Total a Receber</p>
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold">{formatCurrency(totalReceber)}</div>
                </div>

                {/* Área para Prints */}
                <div className="space-y-4 pt-4 break-inside-avoid">
                  <h3 className="font-bold text-slate-700 text-sm uppercase flex items-center">
                    <span className="mr-2">📸</span> Área para Prints das Tabelas
                  </h3>
                  <div className="border-4 border-dashed border-slate-200 p-20 rounded-2xl text-center bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
                    <p className="text-slate-400 font-bold text-lg mb-2 uppercase">Espaço Reservado: Tabela 1 e Tabela 2</p>
                    <p className="text-slate-400 text-sm">Cole aqui o print das tabelas.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponentes para Limpar o Código ---

const InputGroup = ({ label, value, onChange, type = "text", placeholder, step }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-600 mb-1">{label}</label>
    <input 
      type={type} 
      step={step}
      className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
    />
  </div>
);

const MetricCard = ({ label, value, color, icon }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-900",
    red: "bg-red-50 border-red-100 text-red-700",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-800"
  };
  
  return (
    <div className={`p-3 rounded-lg text-center border ${colors[color]}`}>
      <div className="text-[10px] opacity-70 font-bold uppercase mb-1 flex items-center justify-center">
        <span className="mr-1">{icon}</span> {label}
      </div>
      <div className="text-lg font-extrabold">{value}</div>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <h3 className="font-bold text-blue-900 border-b-2 border-blue-50 pb-2 flex items-center">
    <span className="mr-2">{icon}</span> {title}
  </h3>
);

const RowItem = ({ label, value, valueClass = "font-bold text-slate-800" }) => (
  <div className="flex justify-between items-center text-sm px-3 py-1">
    <span className="text-slate-600">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

export default App;
