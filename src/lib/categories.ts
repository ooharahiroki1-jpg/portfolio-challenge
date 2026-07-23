import type { AssetCategory } from '../types';

export const assetCategories: AssetCategory[] = [
  '金融',
  '成長株',
  '景気敏感',
  '消費',
  '守り',
  '資源',
  '世界株',
  '債券',
  '現金'
];

export const categoryColors: Record<AssetCategory, string> = {
  金融: '#2563EB',
  成長株: '#8B5CF6',
  景気敏感: '#0EA5E9',
  消費: '#F97316',
  守り: '#16A34A',
  資源: '#D97706',
  世界株: '#38BDF8',
  債券: '#64748B',
  現金: '#94A3B8'
};

export const categoryLabels = assetCategories;
