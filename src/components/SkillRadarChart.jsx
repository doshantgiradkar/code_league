// Skill Radar Chart component using SVG

import { motion } from 'framer-motion';

const SkillRadarChart = ({ skills = [] }) => {
    // Limit to top 6 skills for better visualization
    const topSkills = skills.slice(0, 6);
    const numPoints = Math.max(topSkills.length, 3);

    // Calculate polygon points
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;

    const angleStep = (2 * Math.PI) / numPoints;

    const getPointCoords = (index, value) => {
        const angle = angleStep * index - Math.PI / 2;
        const radius = (value / 5) * maxRadius; // assuming proficiency 1-5
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
        };
    };

    // Create grid circles
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

    // Generate path for skill polygon
    const skillPoints = topSkills.map((skill, index) => {
        const coords = getPointCoords(index, skill.proficiency || 3);
        return `${coords.x},${coords.y}`;
    }).join(' ');

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Skills Radar</h2>

            {topSkills.length === 0 ? (
                <p className="text-center text-slate-400 py-10">No skills to display</p>
            ) : (
                <div className="flex flex-col items-center">
                    <svg width="400" height="400" className="mb-6">
                        {/* Grid circles */}
                        {gridLevels.map((level, i) => {
                            const points = [];
                            for (let j = 0; j < numPoints; j++) {
                                const angle = angleStep * j - Math.PI / 2;
                                const radius = level * maxRadius;
                                const x = centerX + radius * Math.cos(angle);
                                const y = centerY + radius * Math.sin(angle);
                                points.push(`${x},${y}`);
                            }
                            return (
                                <polygon
                                    key={i}
                                    points={points.join(' ')}
                                    fill="none"
                                    stroke="rgba(100, 116, 139, 0.2)"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Axis lines */}
                        {topSkills.map((_, index) => {
                            const end = getPointCoords(index, 5);
                            return (
                                <line
                                    key={index}
                                    x1={centerX}
                                    y1={centerY}
                                    x2={end.x}
                                    y2={end.y}
                                    stroke="rgba(100, 116, 139, 0.3)"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Skill polygon */}
                        <motion.polygon
                            points={skillPoints}
                            fill="url(#radar-gradient)"
                            stroke="#06b6d4"
                            strokeWidth="2"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />

                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="radar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>

                        {/* Skill points */}
                        {topSkills.map((skill, index) => {
                            const coords = getPointCoords(index, skill.proficiency || 3);
                            return (
                                <motion.circle
                                    key={index}
                                    cx={coords.x}
                                    cy={coords.y}
                                    r="6"
                                    fill="#06b6d4"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 * index, type: 'spring' }}
                                />
                            );
                        })}

                        {/* Labels */}
                        {topSkills.map((skill, index) => {
                            const labelCoords = getPointCoords(index, 5.5);
                            return (
                                <text
                                    key={index}
                                    x={labelCoords.x}
                                    y={labelCoords.y}
                                    fill="#94a3b8"
                                    fontSize="14"
                                    fontWeight="600"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {skill.name}
                                </text>
                            );
                        })}
                    </svg>

                    {/* Legend */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
                        {topSkills.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <div>
                                    <p className="text-sm text-white font-medium">{skill.name}</p>
                                    <p className="text-xs text-slate-500">Level {skill.proficiency}/5</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillRadarChart;
