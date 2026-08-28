export type PortfolioStatusContext = 'unit' | 'room' | 'parking' | 'property-grid';

function normalizeStatus(status: string | null | undefined): string {
  return (status || '').toLowerCase().trim();
}

function isMaintenanceOrBlocked(value: string): boolean {
  return value.includes('maintenance')
    || value.includes('repair')
    || value.includes('blocked');
}

/**
 * Status badges — Figma Units/Rooms lists (596:15843 / 609:2453):
 * Occupied = solid primary #26264F white text, 4px
 * Vacant   = solid danger  #C94A4A white text, 4px
 */
export function portfolioStatusClass(
  status: string | null | undefined,
  context: PortfolioStatusContext
): string {
  const value = normalizeStatus(status);

  if (context === 'parking') {
    if (value.includes('available')) {
      return 'ov-portfolio-pill--success';
    }
    if (value.includes('occupied')) {
      return 'ov-portfolio-pill--primary';
    }
    if (value.includes('reserved')) {
      return 'ov-portfolio-pill--info';
    }
    if (isMaintenanceOrBlocked(value)) {
      return 'ov-portfolio-pill--warning';
    }
    return 'ov-portfolio-pill--muted';
  }

  if (context === 'property-grid') {
    if (value.includes('active')) {
      return 'ov-portfolio-pill--success';
    }
    if (value.includes('draft') || value.includes('suspended') || value.includes('inactive')) {
      return 'ov-portfolio-pill--warning';
    }
    return 'ov-portfolio-pill--muted';
  }

  if (value.includes('occupied')) {
    return 'ov-portfolio-pill--primary';
  }
  if (value.includes('vacant')) {
    return 'ov-portfolio-pill--danger';
  }
  if (value.includes('available')) {
    return 'ov-portfolio-pill--success';
  }
  if (value.includes('reserved')) {
    return 'ov-portfolio-pill--info';
  }
  if (isMaintenanceOrBlocked(value)) {
    return 'ov-portfolio-pill--warning';
  }
  if (value.includes('active')) {
    return 'ov-portfolio-pill--primary';
  }

  return 'ov-portfolio-pill--muted';
}

/** Parking Type — Figma 611:3190 Free = muted outline, Chargeable = solid primary */
export function parkingTypeClass(type: string | null | undefined): string {
  const value = normalizeStatus(type);
  if (value.includes('chargeable')) {
    return 'ov-portfolio-pill--primary';
  }
  return 'ov-portfolio-pill--muted';
}

/** Parking Cycle — Figma 611:3190 Fixed/Daily/etc = muted outline, 4px */
export function parkingCycleClass(_cycle?: string | null): string {
  return 'ov-portfolio-pill--muted';
}
