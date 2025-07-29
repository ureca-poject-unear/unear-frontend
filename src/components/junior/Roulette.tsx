import React, { useState } from 'react';
import { makeSystem } from '@mui/system';
import clsx from 'clsx';
import { FiArrowRight } from 'react-icons/fi';

interface PrizeData {
  id: string;
  brandName: string;
  prizeName: string;
  prizeImg: string;
}

interface RouletteProps {
  prizeData: PrizeData[];
}

const useStyles = (props: { rotate: string; nbTurn: number; selectedItem: number }) => {
  return makeSystem(() => ({
    wrap: {
      width: '100vw',
      height: '100vh',
      paddingTop: 80,
      backgroundColor: '#0080f1',
    },
    contents: {
      width: '100%',
      padding: '16px 24px 0',
      color: '#fff',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    rouletteOuter: {
      position: 'relative',
      marginTop: 38,
      width: '95%',
      maxWidth: 327,
      minWidth: 270,
      borderRadius: '50%',
      backgroundColor: '#EAF2FA',
      boxShadow: `0px 12px 20px rgba(0, 0, 0, 0.25)`,
      aspectRatio: '1/1',
    },
    roulette: {
      position: 'absolute',
      overflow: 'hidden',
      top: '3%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      borderRadius: '50%',
      border: `4px solid #B1C8DE`,
      transformOrigin: 'center',
      transitionTimingFunction: 'ease-in-out',
      transform: `rotate(${props.rotate})`,
    },
    roulettePin: {
      position: 'absolute',
      top: -16,
      left: '50%',
      marginLeft: '-15px',
    },
    item: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: '10px',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      color: 'black',
      fontSize: '10px',
      '&:nth-child(1)': {
        background: `conic-gradient(from 337.5deg, #E7EFF3 45deg, #ffffff 45deg 90deg, #E7EFF3 90deg 135deg, #ffffff 135deg 180deg, #E7EFF3 180deg 225deg, #ffffff 225deg 270deg, #E7EFF3 270deg 315deg, #ffffff 315deg)`,
      },
    },
    line: {
      position: 'absolute',
      top: 0,
      bottom: '50%',
      left: '50%',
      width: '4px',
      marginLeft: '-2px',
      background: '#B1C8DE',
      transformOrigin: 'bottom',
    },
    brandName: {
      fontWeight: 400,
      fontSize: '8px',
      lineHeight: '9px',
      color: '#6B778C',
    },
    prizeName: {
      paddingTop: 3,
      paddingBottom: 8,
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '11px',
      color: '#1A1A1A',
    },
    prizeImg: {
      width: 45,
      height: 45,
      margin: `5px auto`,
    },
    prizeImgUrl: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    rouletteOuterBtn: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%)`,
      width: 92,
      height: 92,
      borderRadius: '50%',
      backgroundColor: '#FFDB00',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rouletteBtn: {
      width: 78,
      height: 78,
      borderRadius: '50%',
      backgroundColor: '#0080F1',
      border: 'none',
      color: '#fff',
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    '@keyframes ani': {
      from: {
        transform: `rotate(${props.rotate})`,
      },
      to: {
        transform: `rotate(calc(${props.nbTurn} * 360deg + (-45deg * ${props.selectedItem})))`,
      },
    },
    on: {
      animationName: '$ani',
      animationDuration: '4s',
      animationFillMode: 'forwards',
      animationIterationCount: 1,
      transitionTimingFunction: 'ease-in-out',
    },
    '@media': {
      rouletteOuter: {
        aspectRatio: '1/1',
      },
    },
    '@media (max-width:400px)': {
      rouletteOuter: {
        width: 300,
      },
      prizeName: {
        paddingBottom: 3,
      },
      prizeImg: {
        width: 40,
        height: 40,
      },
      rouletteOuterBtn: {
        width: 80,
        height: 80,
      },
      rouletteBtn: {
        width: 66,
        height: 66,
        fontSize: '15px',
      },
    },
  }));
};

const Roulette: React.FC<RouletteProps> = ({ prizeData }) => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const classes = useStyles({ rotate: '0deg', nbTurn: 5, selectedItem: selectedItem || 0 });

  const handleClick = () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizeData.length);
    setSelectedItem(randomIndex);
    setTimeout(() => {
      setSpinning(false);
    }, 4000); // 애니메이션 종료 시간
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.contents}>
        <div className={classes.rouletteOuter}>
          <div className={clsx(classes.roulette, spinning ? classes.on : '')}>
            <div>
              {prizeData.map((item, i) => {
                return (
                  <div
                    style={{ transform: `rotate(${(i + 1) * 45}deg)` }}
                    className={classes.item}
                    key={item.id}
                  >
                    <div>
                      <div>
                        <p className={classes.brandName}>{item.brandName}</p>
                        <p className={classes.prizeName}>{item.prizeName}</p>
                      </div>
                      <div className={classes.prizeImg}>
                        <img
                          className={classes.prizeImgUrl}
                          src={item.prizeImg}
                          alt={item.prizeName}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              {[...Array(8)].map((n, index) => {
                return (
                  <div
                    className={classes.line}
                    style={{
                      transform: `rotate(${(index + 1) * 45 - 22.5}deg)`,
                    }}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
          <FiArrowRight className={classes.roulettePin} /> {/* 아이콘 사용 수정 */}
          <div className={classes.rouletteOuterBtn}>
            <button className={classes.rouletteBtn} onClick={handleClick} disabled={spinning}>
              <p>도전</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
