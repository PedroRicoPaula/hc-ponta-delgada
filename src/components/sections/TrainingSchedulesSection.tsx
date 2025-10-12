import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trainingSchedules } from '@/data/siteData';
import { useState } from 'react';

const sectionLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 2.0 }
    }
  };



export const TrainingSchedulesSection = () => {
  const toggleSchedule = (type: string) => {
    setOpenSchedules(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

const [openSchedules, setOpenSchedules] = useState<{ [key: string]: boolean }>({});
return (
    <motion.section
        id="training"
        className="py-16 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionLeft}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Horários de Treinos</h2>
          
          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {trainingSchedules.map((schedule) => (
              <Card key={schedule.type} className={`p-6 border-2 ${schedule.color} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-4">{schedule.type}</h3>
                  <div className="space-y-3">
                    {schedule.sessions.map((session, index) => (
                      <div key={index} className="bg-white/50 p-3 rounded-lg">
                        <p className="font-semibold text-sm">{session.day}</p>
                        <p className="text-sm font-mono">{session.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Mobile View - Collapsible */}
          <div className="md:hidden space-y-4">
            {trainingSchedules.map((schedule) => (
              <Card key={schedule.type} className={`border-2 ${schedule.color} overflow-hidden`}>
                <Button
                  onClick={() => toggleSchedule(schedule.type)}
                  className={`w-full p-4 text-left flex justify-between items-center ${schedule.color} hover:opacity-90 transition-all`}
                  variant="ghost"
                >
                  <h3 className="font-bold text-lg">{schedule.type}</h3>
                  <span className={`transform transition-transform duration-200 ${openSchedules[schedule.type] ? 'rotate-180' : 'rotate-0'}`}>
                    ↓
                  </span>
                </Button>
                <div className={`transition-all duration-300 ease-in-out ${openSchedules[schedule.type] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-4 bg-white/50 space-y-3">
                    {schedule.sessions.map((session, index) => (
                      <div key={index} className="bg-white/70 p-3 rounded-lg">
                        <p className="font-semibold text-sm">{session.day}</p>
                        <p className="text-sm font-mono">{session.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>
    );
};