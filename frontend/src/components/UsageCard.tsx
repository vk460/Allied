import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const data = {
  labels: ['Oct 1','Oct 2','Oct 3','Oct 4','Oct 5','Oct 6','Oct 7'],
  datasets: [{
    label: 'API Calls',
    data: [1200, 1530, 980, 2100, 2500, 1800, 1300],
    tension: 0.35,
    fill: true,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.9)'
  }]
}

export default function UsageCard(){
  return (
    <div className="card p-6 rounded-2xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">Usage Summary (this month)</h2>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-white/3">
              <div className="text-xs text-slate-400">Requests</div>
              <div className="text-2xl font-bold">12,450</div>
            </div>
            <div className="p-3 rounded-lg bg-white/3">
              <div className="text-xs text-slate-400">Audio Minutes</div>
              <div className="text-2xl font-bold">320</div>
            </div>
            <div className="p-3 rounded-lg bg-white/3">
              <div className="text-xs text-slate-400">Translated Docs</div>
              <div className="text-2xl font-bold">42</div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <Line data={data} />
        </div>
      </div>
    </div>
  )
}
