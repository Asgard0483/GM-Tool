import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { Network } from 'lucide-react';
import {
  ReactFlow, Background, Controls, MiniMap,
  type Node, type Edge, type NodeTypes,
  Handle, Position, useNodesState, useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCharacterStore } from '@/features/characters/store/characterStore';
import { useRelationshipStore } from '@/features/relationships/store/relationshipStore';
import styles from './NetworkPage.module.css';

const TYPE_COLORS: Record<string, string> = {
  pc: '#6366f1', nsc: '#0284c7', enemy: '#dc2626', contact: '#d97706',
  faction_rep: '#16a34a', creature: '#7c3aed', other: '#6b7280',
};
const REL_COLORS: Record<string, string> = {
  familie: '#7c3aed', freundschaft: '#16a34a', bekanntschaft: '#6b7280',
  allianz: '#0284c7', loyalitaet: '#0891b2', schuld_verpflichtung: '#d97706',
  rivalitaet: '#ea580c', feindschaft: '#dc2626', mentor_schueler: '#7c3aed',
  liebe_affaere: '#db2777', geheimverbindung: '#374151',
};

function CharacterNode({ data }: { data: { name: string; typ: string; initials: string } }) {
  const color = TYPE_COLORS[data.typ] ?? '#6b7280';
  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '8px 12px',
      minWidth: '100px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-md)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: color }} />
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: color, color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 700,
        margin: '0 auto 6px',
      }}>{data.initials}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
        {data.name}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color }} />
    </div>
  );
}

const nodeTypes: NodeTypes = { character: CharacterNode };

export default function NetworkPage() {
  const { t } = useTranslation();
  const characters = useCharacterStore(s => s.characters);
  const relationships = useRelationshipStore(s => s.relationships);
  const navigate = useNavigate();

  const initialNodes: Node[] = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(characters.length));
    return characters.map((c, i) => ({
      id: c.id,
      type: 'character',
      position: {
        x: (i % cols) * 200 + (Math.floor(i / cols) % 2) * 80,
        y: Math.floor(i / cols) * 150,
      },
      data: {
        name: c.name.length > 14 ? c.name.slice(0, 13) + '…' : c.name,
        typ: c.typ,
        initials: c.name.slice(0, 2).toUpperCase(),
      },
    }));
  }, [characters]);

  const initialEdges: Edge[] = useMemo(() =>
    relationships.map(r => ({
      id: r.id,
      source: r.source_character_id,
      target: r.target_character_id,
      animated: r.relationship_type === 'geheimverbindung',
      style: {
        stroke: REL_COLORS[r.relationship_type] ?? '#6b7280',
        strokeWidth: r.intensity,
        strokeDasharray: r.visibility === 'secret' ? '5 5' : undefined,
      },
      markerEnd: r.direction === 'directed' ? { type: 'arrowclosed' as const } : undefined,
      label: r.relationship_type,
      labelStyle: { fontSize: 10, fill: 'var(--color-text-tertiary)' },
    })), [relationships]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    navigate(`/characters/${node.id}`);
  }, [navigate]);

  if (characters.length === 0) {
    return (
      <div className={styles.empty}>
        <Network size={48} className={styles.emptyIcon} />
        <h2>{t('characters.noCharacters')}</h2>
        <p>{t('characters.emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Beziehungsnetzwerk</h1>
        <span className={styles.sub}>{characters.length} Charaktere · {relationships.length} Beziehungen · Klick auf Knoten öffnet Detailseite</span>
      </div>
      <div className={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          colorMode="system"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
