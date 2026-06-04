import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { UPGRADES } from '../systems/shop';
import type { UpgradeDef } from '../systems/shop';
import { getSynergiesForUpgrade, getActiveSynergies, SYNERGIES } from '../systems/synergies';
import type { SynergyDef } from '../systems/synergies';

const SHOP_CSS = `
@keyframes border-shop-pulse {
  0%,100% { box-shadow: 0 0 16px #FFE600, inset 0 0 16px rgba(255,230,0,0.06); }
  50%      { box-shadow: 0 0 32px #FF0080, inset 0 0 24px rgba(255,0,128,0.10); }
}
@keyframes scanline-drift {
  from { background-position: 0 0; }
  to   { background-position: 0 100px; }
}
`;

function injectShopStyles() {
  if (document.getElementById('shop-styles')) return;
  const s = document.createElement('style');
  s.id = 'shop-styles';
  s.textContent = SHOP_CSS;
  document.head.appendChild(s);
}

export function ShopScreen() {
  const { game, upgrades, purchaseUpgrade, addMaxHp, closeShop } = useStore();
  const [selected, setSelected] = useState<UpgradeDef | null>(null);

  injectShopStyles();

  const getLevel = (id: string) => upgrades[id] ?? 0;

  const canAfford = (def: UpgradeDef) => game.reiki >= def.price;
  const isMaxed = (def: UpgradeDef) => getLevel(def.id) >= def.maxLevel;

  const activeSynergies = getActiveSynergies(upgrades);

  function handleBuy(def: UpgradeDef) {
    if (!canAfford(def) || isMaxed(def)) return;
    purchaseUpgrade(def.id, def.price);
    if (def.id === 'soul_shard') addMaxHp(1);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(4,0,12,0.95)', backdropFilter: 'blur(3px)' }}
    >
      {/* Animated scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,230,0,0.02) 3px, rgba(255,230,0,0.02) 4px)',
          animation: 'scanline-drift 4s linear infinite',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(155,0,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,0,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content card */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: -24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: -24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '44px 52px',
          border: '2px solid rgba(255,230,0,0.35)',
          animation: 'border-shop-pulse 2.4s ease-in-out infinite',
          background: 'rgba(10,0,24,0.9)',
          maxWidth: 860,
          width: '90vw',
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 9,
              color: '#FFE600',
              textShadow: '0 0 10px #FFE600',
              letterSpacing: 5,
            }}
          >
            ショップ
          </div>

          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 28,
              color: '#FF0080',
              textShadow: '0 0 20px #FF0080, 0 0 50px #FF0080, 4px 4px 0 #660030',
              letterSpacing: 3,
            }}
          >
            UPGRADE SHOP
          </div>

          {/* Neon divider */}
          <div
            style={{
              width: 480,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #FFE600, #FF0080, #9B00FF, transparent)',
              boxShadow: '0 0 10px #FFE600',
              marginTop: 4,
            }}
          />

          {/* Reiki balance */}
          <div className="flex items-center gap-3 mt-1">
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 9,
                color: '#666',
                letterSpacing: 2,
              }}
            >
              霊気 BALANCE
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 18,
                color: '#FFE600',
                textShadow: '0 0 12px #FFE600',
              }}
            >
              ¥{game.reiki}
            </div>
          </div>
        </div>

        {/* Active Synergies panel */}
        {activeSynergies.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 7,
                color: '#9B00FF',
                letterSpacing: 3,
                textShadow: '0 0 6px #9B00FF',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              ◈ ACTIVE SYNERGIES ◈
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {activeSynergies.map((syn) => (
                <motion.div
                  key={syn.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    border: `1px solid ${syn.color}66`,
                    background: `${syn.color}11`,
                    boxShadow: `0 0 10px ${syn.color}33`,
                  }}
                >
                  <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 10, color: syn.color, textShadow: `0 0 8px ${syn.color}` }}>
                    {syn.icon}
                  </span>
                  <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: syn.color, letterSpacing: 1 }}>
                    {syn.name.toUpperCase()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {UPGRADES.map((def) => (
            <UpgradeCard
              key={def.id}
              def={def}
              level={getLevel(def.id)}
              affordable={canAfford(def)}
              maxed={isMaxed(def)}
              upgrades={upgrades}
              onSelect={() => setSelected(def)}
            />
          ))}
        </div>

        {/* Close button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(155,0,255,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={closeShop}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 11,
              color: '#9B00FF',
              background: 'transparent',
              border: '2px solid rgba(155,0,255,0.4)',
              padding: '12px 40px',
              cursor: 'pointer',
              letterSpacing: 2,
            }}
          >
            ← BACK TO PAUSE
          </motion.button>
        </div>
      </motion.div>

      {/* Item modal */}
      <AnimatePresence>
        {selected && (
          <UpgradeModal
            def={selected}
            level={getLevel(selected.id)}
            affordable={canAfford(selected)}
            maxed={isMaxed(selected)}
            upgrades={upgrades}
            onBuy={() => handleBuy(selected)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface UpgradeCardProps {
  def: UpgradeDef;
  level: number;
  affordable: boolean;
  maxed: boolean;
  upgrades: Record<string, number>;
  onSelect: () => void;
}

function UpgradeCard({ def, level, affordable, maxed, upgrades, onSelect }: UpgradeCardProps) {
  const { active: activeSyns, potential: potentialSyns } = getSynergiesForUpgrade(def.id, upgrades);
  const hasSynergyHint = activeSyns.length > 0 || potentialSyns.length > 0;

  const borderColor = activeSyns.length > 0
    ? activeSyns[0].color
    : maxed
    ? `${def.iconColor}99`
    : affordable
    ? `${def.iconColor}55`
    : 'rgba(80,80,80,0.35)';

  const buttonLabel = maxed ? 'MAXED' : affordable ? 'VIEW' : 'VIEW';
  const buttonColor = maxed ? '#444' : '#9B00FF';

  return (
    <motion.div
      whileHover={{ scale: 1.04, borderColor: def.iconColor }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '20px 12px 16px',
        border: `2px solid ${borderColor}`,
        background: 'rgba(6,0,18,0.7)',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        position: 'relative',
      }}
    >
      {/* Level indicator — top-right badge */}
      {def.maxLevel > 1 && level > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: def.iconColor,
            textShadow: `0 0 6px ${def.iconColor}`,
          }}
        >
          {'■'.repeat(level)}{'□'.repeat(def.maxLevel - level)}
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 28,
          color: maxed ? `${def.iconColor}88` : def.iconColor,
          textShadow: maxed ? 'none' : `0 0 16px ${def.iconColor}, 0 0 32px ${def.iconColor}`,
          lineHeight: 1,
        }}
      >
        {def.icon}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 6,
          color: maxed ? '#444' : '#ccc',
          textAlign: 'center',
          lineHeight: 1.6,
          minHeight: 28,
        }}
      >
        {def.name.toUpperCase()}
      </div>

      {/* Price */}
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 9,
          color: maxed ? '#333' : affordable ? '#FFE600' : '#555',
          textShadow: maxed ? 'none' : affordable ? '0 0 8px #FFE600' : 'none',
        }}
      >
        {maxed ? '—' : `¥${def.price}`}
      </div>

      {/* Button */}
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 7,
          color: buttonColor,
          border: `1px solid ${buttonColor}55`,
          padding: '6px 14px',
          width: '100%',
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        {buttonLabel}
      </div>

      {/* Synergy hint badges */}
      {hasSynergyHint && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', marginTop: 2 }}>
          {activeSyns.map((syn) => (
            <div
              key={syn.id}
              title={syn.name}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 6,
                color: syn.color,
                background: `${syn.color}22`,
                border: `1px solid ${syn.color}88`,
                padding: '2px 4px',
                textShadow: `0 0 6px ${syn.color}`,
                letterSpacing: 0,
              }}
            >
              {syn.icon}
            </div>
          ))}
          {potentialSyns.map((syn) => (
            <div
              key={syn.id}
              title={`Potential: ${syn.name}`}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 6,
                color: '#555',
                background: 'transparent',
                border: '1px solid #333',
                padding: '2px 4px',
                letterSpacing: 0,
              }}
            >
              {syn.icon}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

interface UpgradeModalProps {
  def: UpgradeDef;
  level: number;
  affordable: boolean;
  maxed: boolean;
  upgrades: Record<string, number>;
  onBuy: () => void;
  onClose: () => void;
}

function UpgradeModal({ def, level, affordable, maxed, upgrades, onBuy, onClose }: UpgradeModalProps) {
  function handleBuy() {
    if (maxed || !affordable) return;
    onBuy();
  }

  const { active: activeSyns, potential: potentialSyns } = getSynergiesForUpgrade(def.id, upgrades);
  const buyLabel = maxed ? '✓ MAXED OUT' : affordable ? `¥${def.price}  BUY` : 'NOT ENOUGH 霊気';
  const canBuy = !maxed && affordable;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 10, background: 'rgba(2,0,8,0.82)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.82, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: '48px 56px',
          border: `2px solid ${def.iconColor}66`,
          background: 'rgba(10,0,24,0.96)',
          boxShadow: `0 0 40px ${def.iconColor}33, 0 0 80px rgba(0,0,0,0.8)`,
          maxWidth: 440,
          width: '80vw',
          position: 'relative',
        }}
      >
        {/* Close X */}
        <motion.button
          whileHover={{ scale: 1.2, color: '#fff' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            color: '#555',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: 0,
          }}
        >
          ✕
        </motion.button>

        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 44,
            color: def.iconColor,
            textShadow: `0 0 20px ${def.iconColor}, 0 0 50px ${def.iconColor}`,
            lineHeight: 1,
          }}
        >
          {def.icon}
        </motion.div>

        {/* Name */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 14,
            color: '#fff',
            textShadow: `0 0 10px ${def.iconColor}`,
            textAlign: 'center',
            letterSpacing: 2,
          }}
        >
          {def.name.toUpperCase()}
        </div>

        {/* JP name */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 9,
            color: '#9B00FF',
            textShadow: '0 0 8px #9B00FF',
            letterSpacing: 4,
          }}
        >
          {def.nameJP}
        </div>

        {/* Level dots */}
        {def.maxLevel > 1 && (
          <div className="flex items-center gap-2">
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 7, color: '#555', letterSpacing: 2 }}>
              LEVEL
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 10, color: def.iconColor, textShadow: `0 0 8px ${def.iconColor}`, letterSpacing: 4 }}>
              {'■'.repeat(level)}{'□'.repeat(def.maxLevel - level)}
            </div>
          </div>
        )}

        {/* Neon divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: `linear-gradient(90deg, transparent, ${def.iconColor}, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: '#888',
            lineHeight: 2,
            textAlign: 'center',
            maxWidth: 320,
          }}
        >
          {def.description}
        </div>

        {/* Synergy hints */}
        {(activeSyns.length > 0 || potentialSyns.length > 0) && (
          <>
            <div
              style={{
                width: '100%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(155,0,255,0.4), transparent)',
              }}
            />
            <div style={{ width: '100%' }}>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 6,
                  color: '#9B00FF',
                  letterSpacing: 2,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                SYNERGIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activeSyns.map((syn) => (
                  <SynergyHint key={syn.id} syn={syn} active={true} />
                ))}
                {potentialSyns.map((syn) => (
                  <SynergyHint key={syn.id} syn={syn} active={false} upgrades={upgrades} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(155,0,255,0.4), transparent)',
          }}
        />

        {/* Buy button */}
        <motion.button
          whileHover={canBuy ? { scale: 1.06, boxShadow: `0 0 30px ${def.iconColor}` } : {}}
          whileTap={canBuy ? { scale: 0.96 } : {}}
          onClick={handleBuy}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 11,
            color: maxed ? '#555' : canBuy ? '#fff' : '#444',
            background: maxed
              ? 'transparent'
              : canBuy
              ? `linear-gradient(135deg, #9B00FF, ${def.iconColor})`
              : 'transparent',
            border: maxed
              ? '2px solid #333'
              : canBuy
              ? `2px solid ${def.iconColor}`
              : '2px solid #333',
            boxShadow: canBuy ? `0 0 16px ${def.iconColor}88` : 'none',
            padding: '14px 0',
            width: '100%',
            cursor: canBuy ? 'pointer' : 'default',
            letterSpacing: 2,
            textShadow: canBuy ? '0 0 8px rgba(255,255,255,0.7)' : 'none',
            textAlign: 'center',
          }}
        >
          {buyLabel}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── SynergyHint ───────────────────────────────────────────────────────────────

interface SynergyHintProps {
  syn: SynergyDef;
  active: boolean;
  upgrades?: Record<string, number>;
}

function SynergyHint({ syn, active, upgrades }: SynergyHintProps) {
  // For potential synergies, find which upgrades are missing
  const missingIds = !active && upgrades
    ? syn.requires.filter((id) => (upgrades[id] ?? 0) < 1)
    : [];

  const missingNames = missingIds.map((id) => {
    const def = UPGRADES.find((u) => u.id === id);
    return def ? def.name : id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  });

  return (
    <motion.div
      initial={active ? { scale: 0.9, opacity: 0 } : {}}
      animate={active ? { scale: 1, opacity: 1 } : {}}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '8px 10px',
        border: `1px solid ${active ? syn.color + '88' : '#333'}`,
        background: active ? `${syn.color}11` : 'transparent',
        boxShadow: active ? `0 0 8px ${syn.color}22` : 'none',
      }}
    >
      <span
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 10,
          color: active ? syn.color : '#444',
          textShadow: active ? `0 0 8px ${syn.color}` : 'none',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {syn.icon}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: active ? syn.color : '#555',
            textShadow: active ? `0 0 6px ${syn.color}` : 'none',
            letterSpacing: 1,
          }}
        >
          {syn.name.toUpperCase()}
          {active && (
            <span style={{ color: '#00FF88', marginLeft: 6, fontSize: 6 }}>ACTIVE</span>
          )}
        </div>
        {!active && missingNames.length > 0 && (
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 5,
              color: '#444',
              lineHeight: 1.8,
            }}
          >
            NEEDS: {missingNames.join(', ')}
          </div>
        )}
        {active && (
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 5,
              color: '#666',
              lineHeight: 1.8,
            }}
          >
            {syn.description.slice(0, 80)}...
          </div>
        )}
      </div>
    </motion.div>
  );
}
