'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface WeatherDay {
  date: string
  condition: 'clear' | 'rain' | 'snow' | 'wind' | 'extreme'
  workable: boolean
  impact?: string
}

interface WeatherImpactProps {
  projectName: string
  month: string
  year: number
  weatherData: WeatherDay[]
}

export default function WeatherImpactTracker({ projectName, month, year, weatherData }: WeatherImpactProps) {
  const [selectedDay, setSelectedDay] = useState<WeatherDay | null>(null)

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return '☀️'
      case 'rain':
        return '🌧️'
      case 'snow':
        return '❄️'
      case 'wind':
        return '💨'
      case 'extreme':
        return '⚠️'
      default:
        return '☁️'
    }
  }

  const getConditionColor = (condition: string, workable: boolean) => {
    if (!workable) return 'bg-red-100 border-red-300 text-red-900'

    switch (condition) {
      case 'clear':
        return 'bg-green-100 border-green-300 text-green-900'
      case 'rain':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900'
      case 'snow':
        return 'bg-blue-100 border-blue-300 text-blue-900'
      case 'wind':
        return 'bg-orange-100 border-orange-300 text-orange-900'
      case 'extreme':
        return 'bg-red-100 border-red-300 text-red-900'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900'
    }
  }

  const workableDays = weatherData.filter(d => d.workable).length
  const delayedDays = weatherData.filter(d => !d.workable).length
  const completionRate = Math.round((workableDays / weatherData.length) * 100)

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Weather Impact Tracker</h3>
          <p className="text-gray-600">{projectName} - {month} {year}</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-3xl font-bold text-green-700">{workableDays}</div>
            <div className="text-sm text-green-600">Workable Days</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-3xl font-bold text-red-700">{delayedDays}</div>
            <div className="text-sm text-red-600">Weather Delays</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-3xl font-bold text-blue-700">{completionRate}%</div>
            <div className="text-sm text-blue-600">Work Completion Rate</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700">{weatherData.length}</div>
            <div className="text-sm text-yellow-600">Total Days Tracked</div>
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weatherData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.01 }}
                onClick={() => setSelectedDay(day)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer
                  transition-all hover:scale-105 hover:shadow-md
                  ${getConditionColor(day.condition, day.workable)}
                `}
              >
                <div className="text-2xl">{getConditionIcon(day.condition)}</div>
                <div className="text-xs font-semibold mt-1">
                  {new Date(day.date).getDate()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Day Details */}
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg text-gray-900">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl">{getConditionIcon(selectedDay.condition)}</span>
                  <span className="capitalize text-gray-700">{selectedDay.condition}</span>
                </div>
                <div className={`inline-block px-2 py-1 rounded text-sm font-semibold mt-2 ${
                  selectedDay.workable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedDay.workable ? 'Work Proceeded' : 'Work Delayed'}
                </div>
                {selectedDay.impact && (
                  <p className="mt-3 text-gray-600">{selectedDay.impact}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
            <span className="text-gray-600">Clear/Workable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-300"></div>
            <span className="text-gray-600">Light Rain/Partial Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
            <span className="text-gray-600">Weather Delay</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}