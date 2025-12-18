import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registro dos elementos necessários para o Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ExtratoPerformance = () => {
  // Estado centralizado para os inputs
  const [dados, setDados] = useState({
    liderName: '',
    rede: '',
    episodio: '',
    inicios: 0,
    inativas: 0,
    cadastros: 0,
    ativas: 0,
    iniciosCompletosCount: 0,
    valTabela1: 0,
    valTabela2: 0,
    valTarget: 0,
    valEstrela: 0,
  });

  // Handlers para atualização de estado
  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setDados(prev => ({
      ...prev,
      [id]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Cálculos derivados (Memoized para eficiência)
  const metricas = useMemo(() => {
    const percCalc = dados.cadastros > 0 ? (dados.ativas / dados.cadastros) * 100 : 0;
    const saldo = dados.inicios - dados.inativas;
    const iniCompVal = dados.iniciosCompletosCount * 50;
    const total = dados.valTabela1 + dados.valTabela2 + iniCompVal + dados.valTarget + dados.valEstrela;

    return { percCalc, saldo, iniCompVal, total };
  }, [dados]);

  const currencyFormatter = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  // Configuração do Gráfico
  const chartData = {
    labels: ['Tab 1', 'Tab 2', 'Inícios', 'Bônus'],
    datasets: [{
      data: [
        dados.valTabela1, 
        dados.valTabela2, 
        metricas.iniCompVal, 
        dados.valTarget + dados.valEstrela
      ],
      backgroundColor: ['#1e3a8a', '#d97706', '#10b981', '#8b5cf6'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { boxWidth: 8, font: { size: 9, weight: 'bold' }, padding: 15 } 
      }
    },
    cutout: '75%'
  };

  return (
    <div className="text-slate-800 bg-slate-50 min-h-screen font-['Montserrat']">
      {/* Estilos customizados injetados via Tailwind e CSS inline para fidelidade */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
        .gold-gradient { background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); }
        .navy-gradient { background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); }
        .card-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        @media print { .no-print { display: none !important; } }
      `}</style>

      {/* Navbar */}
      <nav className="navy-gradient text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-xl font-bold tracking-wide">REGIONAL RJ2</h1>
              <p className="text-xs text-blue-200">Gestão de Performance</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center">
            <span className="mr-2">📄</span> GERAR PDF / ENVIAR
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center max-w-3xl mx-auto no-print">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Painel de Geração de Extrato</h2>
          <p className="text-slate-600">Preencha os dados abaixo para gerar o extrato automático.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUNA ESQUERDA: INPUTS */}
          <div className="lg:col-span-4 space-y-6 no-print">
            <div className="bg-white p-6 rounded-xl card-shadow border-t-4 border-blue-900">
              <h3 className="text-lg font-bold mb-4 flex items-center">👤 Cadastro</h3>
              <div className="space-y-3">
                <InputGroup label="Nome do(a) Líder" id="liderName" value={dados.liderName} onChange={handleChange} />
                <InputGroup label="Rede" id="rede" value={dados.rede} onChange={handleChange} />
                <InputGroup label="Episódio Atual" id="episodio" value={dados.episodio} onChange={handleChange} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl card-shadow border-t-4 border-amber-500">
              <h3 className="text-lg font-bold mb-4 flex items-center">📊 Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <InputGroup label="Inícios" id="inicios" type="number" value={dados.inicios} onChange={handleChange} />
                <InputGroup label="Inativas i6" id="inativas" type="number" value={dados.inativas} onChange={handleChange} />
                <InputGroup label="Total Cadastro" id="cadastros" type="number" value={dados.cadastros} onChange={handleChange} />
                <InputGroup label="Ativas Real" id="ativas" type="number" value={dados.ativas} onChange={handleChange} />
                <div className="col-span-2">
                  <InputGroup label="Inícios Completos (Qtd)" id="iniciosCompletosCount" type="number" value={dados.iniciosCompletosCount} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl card-shadow border-t-4 border-green-600">
              <h3 className="text-lg font-bold mb-4 flex items-center">💸 Ganhos</h3>
              <div className="space-y-3">
                <InputGroup label="Tabela 1" id="valTabela1" type="number" value={dados.valTabela1} onChange={handleChange} />
                <InputGroup label="Tabela 2" id="valTabela2" type="number" value={dados.valTabela2} onChange={handleChange} />
                <InputGroup label="Bônus Target" id="valTarget" type="number" value={dados.valTarget} onChange={handleChange} />
                <InputGroup label="Bônus Estrela" id="valEstrela" type="number" value={dados.valEstrela} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: DASHBOARD */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl card-shadow overflow-hidden" id="printableArea">
              <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-center border-b-4 border-amber-500">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{dados.liderName || 'Nome do(a) Líder'}</h2>
                  <p className="text-amber-400 font-semibold">Rede: {dados.rede || '---'}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-sm opacity-80 font-bold uppercase">Extrato de Ganhos</div>
                  <div className="text-xl font-extrabold text-amber-500">Episódio {dados.episodio || '---'}</div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Métricas Principais */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <MetricCard label="Inícios" val={dados.inicios} color="blue" icon="🚀" />
                  <MetricCard label="Inativas i6" val={dados.inativas} color="red" icon="⚠️" />
                  <MetricCard label="Cadastro" val={dados.cadastros} color="slate" icon="📋" />
                  <MetricCard label="Ativas" val={dados.ativas} color="emerald" icon="✅" />
                  <div className={`p-3 rounded-lg text-center border transition-colors ${
                    metricas.saldo > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                    metricas.saldo < 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    <div className="text-[10px] font-bold uppercase mb-1 flex items-center justify-center">⚖️ Saldo</div>
                    <div className="text-lg font-extrabold">{metricas.saldo}</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="font-bold text-blue-900 border-b-2 border-blue-50 pb-2">📊 Performance</h3>
                    <div className="flex justify-between items-center text-sm py-2 px-3 bg-slate-50 rounded">
                      <span className="text-slate-600 font-semibold">% de Atividade:</span>
                      <span className="font-bold text-blue-700 text-lg">{metricas.percCalc.toFixed(1)}%</span>
                    </div>
                    
                    <h3 className="font-bold text-blue-900 border-b-2 border-blue-50 pb-2 pt-4">💰 Ganhos</h3>
                    <GainRow label="Tabela 1 (Liderança)" val={currencyFormatter.format(dados.valTabela1)} />
                    <GainRow label="Tabela 2 (% Receita)" val={currencyFormatter.format(dados.valTabela2)} />
                    <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded px-3 border border-green-100">
                      <span className="text-green-800 font-semibold">Inícios Completos (Bônus)</span>
                      <span className="font-bold text-green-800">{currencyFormatter.format(metricas.iniCompVal)}</span>
                    </div>
                    <GainRow label="Bônus Target Ativos" val={currencyFormatter.format(dados.valTarget)} />
                    <GainRow label="Bônus Target Estrela" val={currencyFormatter.format(dados.valEstrela)} />
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase">Visão de Ganhos</h4>
                    <div className="w-full h-[250px]">
                      <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-4 w-full">
                      {dados.inicios >= 10 ? (
                        <div className="bg-purple-600 text-white p-3 rounded-xl text-[11px] font-extrabold text-center shadow-md animate-bounce">
                          👑 KIT LÍDER MASTER (10+ Inícios)
                        </div>
                      ) : dados.inicios >= 5 ? (
                        <div className="bg-amber-500 text-white p-3 rounded-xl text-[11px] font-extrabold text-center shadow-md">
                          🎁 KIT PRÊMIO LÍDER (5-9 Inícios)
                        </div>
                      ) : (
                        <div className="bg-slate-200 text-slate-400 p-3 rounded-xl text-[10px] font-bold text-center italic border border-slate-300">
                          Nenhum Kit Conquistado (Abaixo de 5)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="gold-gradient p-6 rounded-xl shadow-lg text-white flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-2 md:mb-0">
                    <span className="text-3xl mr-3">💎</span>
                    <div>
                      <p className="text-amber-100 text-sm font-semibold uppercase tracking-wider">Valor Total a Receber</p>
                      <p className="text-xs text-amber-100 opacity-80">Parabéns pelo seu trabalho!</p>
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold">{currencyFormatter.format(metricas.total)}</div>
                </div>

                {/* Print Area Placeholder */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-slate-700 text-sm uppercase">📸 Área para Prints</h3>
                  <div className="border-4 border-dashed border-slate-200 p-20 rounded-2xl text-center bg-slate-25 flex flex-col items-center justify-center min-h-[300px]">
                    <p className="text-slate-400 font-bold uppercase">Espaço Reservado para Tabelas</p>
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

// Sub-componentes auxiliares para organização
const InputGroup = ({ label, id, ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-xs font-semibold text-slate-600 mb-1">{label}</label>
    <input
      id={id}
      className="w-full p-2 border border-slate-300 rounded-md focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
      {...props}
    />
  </div>
);

const MetricCard = ({ label, val, color, icon }) => (
  <div className={`bg-${color}-50 p-3 rounded-lg text-center border border-${color}-100`}>
    <div className={`text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center justify-center`}>
      <span className="mr-1">{icon}</span> {label}
    </div>
    <div className={`text-lg font-extrabold text-${color}-900`}>{val}</div>
  </div>
);

const GainRow = ({ label, val }) => (
  <div className="flex justify-between items-center text-sm px-3">
    <span className="text-slate-600">{label}</span>
    <span className="font-bold text-slate-800">{val}</span>
  </div>
);

export default ExtratoPerformance;
