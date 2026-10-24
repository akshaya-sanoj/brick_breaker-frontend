// src/components/GameCanvas.jsx
import { useEffect, useRef, useState } from 'react';
import { startGameSession, completeGameSession } from '../services/api';

export default function GameCanvas({ setUser, theme, currentTheme }) {    
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('AIMING'); 
  const [turn, setTurn] = useState(1);
  const [totalBalls, setTotalBalls] = useState(10); 
  const [score, setScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const sessionIdRef = useRef(null);
  const statsRef = useRef({ score: 0, bricksDestroyed: 0 });

  const ballsRef = useRef([]);
  const launchRef = useRef({ frames: 0, index: 0, dx: 0, dy: 0 });
  const aimRef = useRef({ isAiming: false, endX: 200, endY: 480 });
  const bricksRef = useRef([]);
  const particlesRef = useRef([]);
  const floatingTextsRef = useRef([]); 
  const earnedBallsRef = useRef(0);

  const brickRowCount = 6;
  const brickColumnCount = 6;
  const brickWidth = 55;
  const brickHeight = 25;
  const brickPadding = 8;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 15;
  const bottomBoundary = 450; 

  const bounceSound = useRef(new Audio('/bounce.mp3'));
  const breakSound = useRef(new Audio('/break.mp3'));

  const playSound = (type) => {
    if (isMuted) return;
    if (type === 'bounce') {
      bounceSound.current.currentTime = 0;
      bounceSound.current.play().catch(() => {});
    } else if (type === 'break') {
      breakSound.current.currentTime = 0;
      breakSound.current.play().catch(() => {});
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  const addFloatingText = (x, y, text, color) => {
    floatingTextsRef.current.push({ x, y, text, color, life: 1.0, dy: -1 });
  };

  const createParticles = (x, y, color, amount = 15) => {
    for (let i = 0; i < amount; i++) {
      particlesRef.current.push({
        x: x + brickWidth / 2,
        y: y + brickHeight / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: color,
        size: Math.random() * 4 + 1
      });
    }
  };

  const resetBalls = () => {
    ballsRef.current = Array.from({ length: totalBalls }, () => ({
      x: 200, y: bottomBoundary, dx: 0, dy: 0, radius: 4, speed: 9, active: false, launched: false
    }));
  };

  const generateRow = (rowIndex, currentTurn) => {
    let newBricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      const rand = Math.random();
      if (rand > 0.5) {
        newBricks.push({
          type: 'brick',
          x: (c * (brickWidth + brickPadding)) + brickOffsetLeft,
          y: (rowIndex * (brickHeight + brickPadding)) + brickOffsetTop,
          status: 1,
          health: currentTurn + Math.floor(Math.random() * 3)
        });
      } else if (rand > 0.4) {
        newBricks.push({
          type: 'bomb',
          x: (c * (brickWidth + brickPadding)) + brickOffsetLeft,
          y: (rowIndex * (brickHeight + brickPadding)) + brickOffsetTop,
          status: 1,
          health: Math.ceil(currentTurn / 2) 
        });
      } else if (rand > 0.35) {
        newBricks.push({
          type: 'powerup',
          x: (c * (brickWidth + brickPadding)) + brickOffsetLeft + (brickWidth / 2),
          y: (rowIndex * (brickHeight + brickPadding)) + brickOffsetTop + (brickHeight / 2),
          status: 1,
          radius: 10
        });
      }
    }
    return newBricks;
  };

  useEffect(() => {
    let initialBricks = [];
    for (let r = 0; r < 3; r++) {
      initialBricks = [...initialBricks, ...generateRow(r, 1)];
    }
    bricksRef.current = initialBricks;
    resetBalls();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      // Canvas internal background color
      ctx.fillStyle = theme === 'light' ? '#f8fafc' : '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const balls = ballsRef.current;
      let bricks = bricksRef.current;
      let particles = particlesRef.current;
      let floatingTexts = floatingTextsRef.current;

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, bottomBoundary);
      ctx.lineTo(canvas.width, bottomBoundary);
      ctx.strokeStyle = 'rgba(255, 61, 0, 0.6)';
      ctx.stroke();
      ctx.setLineDash([]);

      bricks.forEach((item) => {
        if (item.status === 1) {
          if (item.type === 'brick' || item.type === 'bomb') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = item.type === 'bomb' ? '#ff3838' : (item.health > turn * 2 ? '#ff4757' : item.health > turn ? '#ffa502' : '#2ed573');
            ctx.fillStyle = ctx.shadowColor;
            item.color = ctx.shadowColor;
            
            ctx.beginPath();
            ctx.roundRect(item.x, item.y, brickWidth, brickHeight, 4);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = item.type === 'bomb' ? '#fff' : '#000';
            ctx.font = 'bold 14px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.type === 'bomb' ? '💣' : item.health, item.x + brickWidth / 2, item.y + brickHeight / 2);
          } else if (item.type === 'powerup') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00E5FF';
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00E5FF';
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.beginPath();
            ctx.arc(item.x, item.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFF';
            ctx.fill();
          }
        }
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let ft = floatingTexts[i];
        ft.y += ft.dy;
        ft.life -= 0.02;

        if (ft.life <= 0) {
          floatingTexts.splice(i, 1);
        } else {
          ctx.globalAlpha = ft.life;
          ctx.fillStyle = ft.color;
          ctx.font = 'bold 16px "Orbitron", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.globalAlpha = 1.0;
        }
      }

      if (gameState === 'AIMING' && aimRef.current.isAiming) {
        ctx.beginPath();
        ctx.setLineDash([6, 6]);
        ctx.moveTo(200, bottomBoundary);
        ctx.lineTo(aimRef.current.endX, aimRef.current.endY);
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]); 
        ctx.lineWidth = 1;
      }

      if (gameState === 'PLAYING') {
        if (launchRef.current.index < balls.length) {
          launchRef.current.frames++;
          if (launchRef.current.frames % 3 === 0) {
            let ballToLaunch = balls[launchRef.current.index];
            ballToLaunch.active = true;
            ballToLaunch.launched = true;
            ballToLaunch.dx = launchRef.current.dx;
            ballToLaunch.dy = launchRef.current.dy;
            launchRef.current.index++;
          }
        }

        let allBallsReturned = true;

        balls.forEach(ball => {
          if (!ball.active) return;
          allBallsReturned = false;
          ball.x += ball.dx;
          ball.y += ball.dy;

          if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
            playSound('bounce');
          }
          if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
            playSound('bounce');
          }
          
          if (ball.y + ball.radius > bottomBoundary) {
            ball.active = false;
            ball.dy = 0; ball.dx = 0;
            ball.y = bottomBoundary;
          }

          for (let i = 0; i < bricks.length; i++) {
            let item = bricks[i];
            if (item.status === 1) {
              if (item.type === 'brick' || item.type === 'bomb') {
                if (ball.x > item.x && ball.x < item.x + brickWidth && ball.y > item.y && ball.y < item.y + brickHeight) {
                  ball.dy = -ball.dy; 
                  item.health -= 1;      
                  playSound('bounce');
                  
                  if (item.health <= 0) {
                    item.status = 0; 
                    statsRef.current.score += 10;
                    statsRef.current.bricksDestroyed += 1;
                    setScore(statsRef.current.score); 
                    
                    if (item.type === 'bomb') {
                      triggerShake();
                      createParticles(item.x, item.y, '#ff3838', 40);
                      addFloatingText(item.x + brickWidth/2, item.y, "BOOM!", "#ff3838");
                      
                      bricks.forEach(b => {
                        if (b.status === 1 && (b.type === 'brick' || b.type === 'bomb')) {
                          const dist = Math.hypot(b.x - item.x, b.y - item.y);
                          if (dist < brickWidth * 2) {
                            b.health -= 10; 
                            if(b.health <= 0) {
                                b.status = 0;
                                statsRef.current.score += 10;
                                createParticles(b.x, b.y, b.color);
                            }
                          }
                        }
                      });
                    } else {
                      createParticles(item.x, item.y, item.color);
                      addFloatingText(item.x + brickWidth/2, item.y, "+10", item.color);
                    }
                    playSound('break');
                  }
                }
              } else if (item.type === 'powerup') {
                const dx = ball.x - item.x;
                const dy = ball.y - item.y;
                if (Math.sqrt(dx * dx + dy * dy) < ball.radius + item.radius) {
                  item.status = 0;
                  earnedBallsRef.current += 1;
                  createParticles(item.x - brickWidth/2, item.y - brickHeight/2, '#00E5FF');
                  addFloatingText(item.x, item.y, "+1 BALL!", "#00E5FF");
                }
              }
            }
          }
        });

        if (launchRef.current.index >= balls.length && allBallsReturned) {
          advanceTurn();
        }
      }

      balls.forEach(ball => {
        if (ball.launched && ball.y <= bottomBoundary) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#00E5FF';
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#00E5FF';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      if (gameState !== 'GAME_OVER') {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        ctx.fillStyle = theme === 'light' ? 'rgba(248, 250, 252, 0.9)' : 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4757';
        ctx.font = 'bold 36px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillStyle = theme === 'light' ? '#0f172a' : '#FFF';
        ctx.font = '20px "Orbitron", sans-serif';
        ctx.fillText(`Final Score: ${statsRef.current.score}`, canvas.width / 2, canvas.height / 2 + 20);
      }
    };

    const advanceTurn = async () => {
      let isGameOver = false;
      let activeItems = bricksRef.current.filter(b => b.status === 1);

      activeItems.forEach(item => {
        item.y += brickHeight + brickPadding;
        if ((item.type === 'brick' || item.type === 'bomb') && item.y + brickHeight >= bottomBoundary) {
          isGameOver = true;
        }
      });

      if (isGameOver) {
        setGameState('GAME_OVER');
        if (sessionIdRef.current) {
          try {
            const res = await completeGameSession({
              sessionId: sessionIdRef.current,
              score: statsRef.current.score,
              bricksDestroyed: statsRef.current.bricksDestroyed,
              maxCombo: 0
            });
            
            if (res.data && res.data.stats && setUser) {
              localStorage.setItem('user', JSON.stringify(res.data.stats));
              setUser(res.data.stats);
            }
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        const newRow = generateRow(0, turn + 1);
        bricksRef.current = [...newRow, ...activeItems];
        setTurn(prev => prev + 1);
        
        const ballsGained = 1 + earnedBallsRef.current;
        setTotalBalls(prev => prev + ballsGained); 
        earnedBallsRef.current = 0; 
        
        resetBalls();
        setGameState('AIMING');
      }
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, turn, totalBalls, isMuted, theme]);

  const handlePointerDown = (e) => { if (gameState === 'AIMING') { aimRef.current.isAiming = true; updateAim(e); }};
  const handlePointerMove = (e) => { if (aimRef.current.isAiming) updateAim(e); };
  
  const handlePointerUp = async (e) => {
    if (!aimRef.current.isAiming) return;
    aimRef.current.isAiming = false;
    
    if (turn === 1 && !sessionIdRef.current) {
      try {
        const res = await startGameSession();
        sessionIdRef.current = res.data.sessionId;
      } catch (err) {}
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) - 200; 
    const dy = (e.clientY - rect.top) - bottomBoundary;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0 && dy < 0) {
      const speed = 9;
      launchRef.current = { frames: 0, index: 0, dx: (dx / distance) * speed, dy: (dy / distance) * speed };
      setGameState('PLAYING');
    }
  };
  
  const updateAim = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    aimRef.current.endX = e.clientX - rect.left; aimRef.current.endY = e.clientY - rect.top;
  };

  const handleRecallBalls = () => {
    if (gameState === 'PLAYING') {
      ballsRef.current.forEach(ball => {
        if (ball.active) {
          ball.active = false;
          ball.y = bottomBoundary;
          ball.dx = 0;
          ball.dy = 0;
        }
      });
      launchRef.current.index = ballsRef.current.length; 
    }
  };

  const containerBg = theme === 'light' ? '#ffffff' : '#1e293b';
  const boxBg = theme === 'light' ? '#f1f5f9' : '#334155';
  const borderColor = theme === 'light' ? '#cbd5e1' : '#334155';

  return (
    <div style={{ 
        background: containerBg, padding: '25px', borderRadius: '15px', 
        display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: `1px solid ${borderColor}`,
        transform: isShaking ? 'translate(5px, 5px)' : 'translate(0, 0)',
        transition: isShaking ? 'none' : 'transform 0.1s, background 0.3s'
    }}>
      <div style={{ color: currentTheme?.textPrimary || '#fff', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"Orbitron", sans-serif' }}>
        <div style={{ background: boxBg, padding: '8px 15px', borderRadius: '8px' }}>
          <span style={{ color: '#00E5FF', fontWeight: 'bold' }}>TURN {turn}</span>
        </div>
        <div style={{ background: boxBg, padding: '8px 15px', borderRadius: '8px' }}>
          <span style={{ color: '#2ed573', fontWeight: 'bold' }}>SCORE {score}</span>
        </div>
        <div style={{ background: boxBg, padding: '8px 15px', borderRadius: '8px' }}>
           <span>{totalBalls} BALLS</span>
        </div>
      </div>

      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${borderColor}` }}>
        <canvas
          ref={canvasRef} width={400} height={500}
          style={{ cursor: 'crosshair', touchAction: 'none', display: 'block' }}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        />
      </div>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <button 
          onClick={handleRecallBalls}
          disabled={gameState !== 'PLAYING'}
          style={{ flex: 1, padding: '12px', background: gameState === 'PLAYING' ? '#ff4757' : boxBg, color: gameState === 'PLAYING' ? '#fff' : (theme === 'light' ? '#94a3b8' : '#64748b'), border: 'none', borderRadius: '8px', cursor: gameState === 'PLAYING' ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', transition: '0.3s' }}
        >
          ⬇ RECALL BALLS
        </button>
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          style={{ width: '50px', background: boxBg, color: currentTheme?.textPrimary || '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px' }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {gameState === 'GAME_OVER' && (
        <button onClick={() => window.location.reload()} style={{ display: 'block', width: '100%', padding: '15px', marginTop: '15px', cursor: 'pointer', background: 'linear-gradient(90deg, #00E5FF, #2ed573)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Orbitron", sans-serif' }}>
          ▶ PLAY AGAIN
        </button>
      )}
    </div>
  );
}