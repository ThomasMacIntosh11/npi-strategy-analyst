'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NPI_INITIATIVES } from '@/lib/npi-initiatives-data'
import styles from './DVFMatrix.module.css'

interface DVFScore {
  id: number
  desirability: number
  viability: number
  feasibility: number
}

interface DVFScores {
  [key: number]: DVFScore
}

// Department colors based on the legend in the initiatives list
const DEPARTMENT_COLORS: { [key: string]: string } = {
  'Government Relations & Legislative Compliance': '#22C55E',  // Green
  'Public & Member Relations': '#8B5CF6',                      // Purple
  'Professional Standards & Education': '#F97316',             // Orange  
  'Corporate Services': '#3B82F6',                             // Blue
  'Multiple Teams': '#000000',                                 // Black - multiple teams proposing similar ideas
}

const SCORE_OPTIONS = [1, 2, 3, 4, 5]

export default function DVFMatrix() {
  const [dvfScores, setDvfScores] = useState<DVFScores>({})
  const [hoveredDot, setHoveredDot] = useState<number | null>(null)
  const router = useRouter()

  // Load saved scores from localStorage on mount
  useEffect(() => {
    const savedScores = localStorage.getItem('dvfScores')
    if (savedScores) {
      setDvfScores(JSON.parse(savedScores))
    }
  }, [])

  // Save scores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dvfScores', JSON.stringify(dvfScores))
  }, [dvfScores])

  const updateScore = (initiativeId: number, dimension: keyof Omit<DVFScore, 'id'>, value: number) => {
    setDvfScores(prev => ({
      ...prev,
      [initiativeId]: {
        ...prev[initiativeId],
        id: initiativeId,
        [dimension]: value
      }
    }))
  }

  const getInitiativeColor = (initiative: typeof NPI_INITIATIVES[0]) => {
    return DEPARTMENT_COLORS[initiative.department] || '#6B7280'
  }

  // Filter initiatives that have at least one score
  const scoredInitiatives = NPI_INITIATIVES.filter(initiative => 
    dvfScores[initiative.id] && 
    (dvfScores[initiative.id].desirability > 0 || 
     dvfScores[initiative.id].viability > 0 || 
     dvfScores[initiative.id].feasibility > 0)
  )

  // Calculate non-overlapping positions for dots
  const getPositionedInitiatives = () => {
    const positionGroups: { [key: string]: Array<{initiative: typeof NPI_INITIATIVES[0], scores: DVFScore}> } = {}
    
    // Group initiatives by their grid position
    scoredInitiatives.forEach(initiative => {
      const scores = dvfScores[initiative.id]
      if (!scores || !scores.feasibility || !scores.viability || !scores.desirability) return
      
      const positionKey = `${scores.feasibility}-${scores.viability}`
      if (!positionGroups[positionKey]) {
        positionGroups[positionKey] = []
      }
      positionGroups[positionKey].push({ initiative, scores })
    })

    // Calculate offset positions for overlapping dots
    const positionedInitiatives: Array<{
      initiative: typeof NPI_INITIATIVES[0]
      scores: DVFScore
      x: number
      y: number
      radius: number
    }> = []

    Object.values(positionGroups).forEach(group => {
      if (group.length === 1) {
        // Single dot - use exact position with padding for radius
        const { initiative, scores } = group[0]
        const radius = Math.max(8, scores.desirability * 6)
        const padding = radius + 5 // Extra padding to ensure no clipping
        const x = Math.max(padding, Math.min(500 - padding, scores.feasibility * 100 - 50))
        const y = Math.max(padding, Math.min(500 - padding, 500 - (scores.viability * 100 - 50)))
        
        positionedInitiatives.push({ initiative, scores, x, y, radius })
      } else {
        // Multiple dots - arrange in a circle around the center point
        const { scores: baseScores } = group[0]
        const maxRadius = Math.max(...group.map(g => Math.max(8, g.scores.desirability * 6)))
        const offsetRadius = maxRadius + 12 // Space between dots
        const totalRadius = maxRadius + offsetRadius
        const padding = totalRadius + 5 // Ensure no clipping for offset dots
        
        const centerX = Math.max(padding, Math.min(500 - padding, baseScores.feasibility * 100 - 50))
        const centerY = Math.max(padding, Math.min(500 - padding, 500 - (baseScores.viability * 100 - 50)))
        
        group.forEach(({ initiative, scores }, index) => {
          const angle = (2 * Math.PI * index) / group.length
          let x = centerX + Math.cos(angle) * offsetRadius
          let y = centerY + Math.sin(angle) * offsetRadius
          const radius = Math.max(8, scores.desirability * 6)
          
          // Ensure offset dots don't go outside bounds
          x = Math.max(radius + 5, Math.min(500 - radius - 5, x))
          y = Math.max(radius + 5, Math.min(500 - radius - 5, y))
          
          positionedInitiatives.push({ initiative, scores, x, y, radius })
        })
      }
    })

    return positionedInitiatives
  }

  const positionedInitiatives = getPositionedInitiatives()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>DVF Matrix</h1>
        <button onClick={() => router.push('/')} className={styles.backBtn}>
          ← Back to Chat
        </button>
      </div>

      <div className={styles.content}>
        {/* Instructions */}
        <div className={styles.instructions}>
          <h2>Desirability, Viability, Feasibility Framework</h2>
          <p>Score each initiative from 1-5 on the three dimensions. As you input scores, initiatives will appear on the matrix below.</p>
          <div className={styles.definitionGrid}>
            <div className={styles.definitionItem}>
              <strong>Desirability (1-5):</strong> Does this solve a real, meaningful problem that customers genuinely care about?
            </div>
            <div className={styles.definitionItem}>
              <strong>Viability (Y-axis, 1-5):</strong> Will it generate sustainable value for the organization?
            </div>
            <div className={styles.definitionItem}>
              <strong>Feasibility (X-axis, 1-5):</strong> Can we realistically build and deliver this with the resources available?
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className={styles.mainContent}>
          {/* Scoring Interface */}
          <div className={styles.scoringPanel}>
            <h3>Initiative Scoring</h3>
            <div className={styles.initiativesList}>
              {NPI_INITIATIVES.map(initiative => {
                const scores = dvfScores[initiative.id] || { desirability: 0, viability: 0, feasibility: 0 }
                return (
                  <div key={initiative.id} className={styles.initiativeCard}>
                    <div className={styles.initiativeHeader}>
                      <div className={styles.numberLabel}>{initiative.id}</div>
                      <div 
                        className={styles.colorDot} 
                        style={{ backgroundColor: getInitiativeColor(initiative) }}
                      />
                      <div>
                        <h4>{initiative.name}</h4>
                        <p className={styles.department}>{initiative.department}</p>
                        <p className={styles.bucket}>Focus Area : {initiative.focusArea}</p>
                      </div>
                    </div>
                    
                    <div className={styles.scoreGrid}>
                      <div className={styles.scoreGroup}>
                        <label>Desirability</label>
                        <div className={styles.scoreButtons}>
                          {SCORE_OPTIONS.map(score => (
                            <button
                              key={score}
                              className={`${styles.scoreBtn} ${scores.desirability === score ? styles.active : ''}`}
                              onClick={() => updateScore(initiative.id, 'desirability', score)}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.scoreGroup}>
                        <label>Viability</label>
                        <div className={styles.scoreButtons}>
                          {SCORE_OPTIONS.map(score => (
                            <button
                              key={score}
                              className={`${styles.scoreBtn} ${scores.viability === score ? styles.active : ''}`}
                              onClick={() => updateScore(initiative.id, 'viability', score)}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.scoreGroup}>
                        <label>Feasibility</label>
                        <div className={styles.scoreButtons}>
                          {SCORE_OPTIONS.map(score => (
                            <button
                              key={score}
                              className={`${styles.scoreBtn} ${scores.feasibility === score ? styles.active : ''}`}
                              onClick={() => updateScore(initiative.id, 'feasibility', score)}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Matrix Visualization */}
          <div className={styles.matrixPanel}>
            <h3>DVF Matrix</h3>
            <div className={styles.matrixContainer}>
              <div className={styles.yAxisLabel}>Viability</div>
              <div className={styles.matrix}>
                <svg viewBox="0 0 500 500" className={styles.matrixSvg}>
                  {/* Grid lines */}
                  <g className={styles.gridLines}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <g key={i}>
                        <line x1={i * 100} y1={0} x2={i * 100} y2={500} />
                        <line x1={0} y1={500 - i * 100} x2={500} y2={500 - i * 100} />
                      </g>
                    ))}
                  </g>
                  
                  {/* Quadrant labels */}
                  <g className={styles.quadrantLabels}>
                    <text x={125} y={60} textAnchor="middle" className={styles.quadrantText}>
                      Lower priority initiatives
                    </text>
                    <text x={375} y={60} textAnchor="middle" className={styles.quadrantText}>
                      Strategic bets
                    </text>
                    <text x={125} y={440} textAnchor="middle" className={styles.quadrantText}>
                      Incremental improvements
                    </text>
                    <text x={375} y={440} textAnchor="middle" className={styles.quadrantText}>
                      High impact / easier to implement
                    </text>
                  </g>

                  {/* Data points */}
                  {positionedInitiatives.map(({ initiative, x, y, radius }) => (
                    <g key={initiative.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={getInitiativeColor(initiative)}
                        className={styles.dataPoint}
                        onMouseEnter={() => setHoveredDot(initiative.id)}
                        onMouseLeave={() => setHoveredDot(null)}
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={styles.dotNumber}
                        onMouseEnter={() => setHoveredDot(initiative.id)}
                        onMouseLeave={() => setHoveredDot(null)}
                      >
                        {initiative.id}
                      </text>
                    </g>
                  ))}
                </svg>
                
                {/* Tooltip */}
                {hoveredDot && (
                  <div className={styles.tooltip}>
                    {NPI_INITIATIVES.find(i => i.id === hoveredDot)?.name}
                  </div>
                )}
              </div>
              <div className={styles.xAxisLabel}>Feasibility</div>
            </div>
            
            {/* Legend */}
            <div className={styles.legend}>
              <h4>Departments</h4>
              <div className={styles.legendGrid}>
                {Object.entries(DEPARTMENT_COLORS).map(([department, color]) => (
                  <div key={department} className={styles.legendItem}>
                    <div className={styles.colorDot} style={{ backgroundColor: color }} />
                    <span>{department}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}