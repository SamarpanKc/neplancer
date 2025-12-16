import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should filter falsy values', () => {
      const result = cn('class1', false, 'class2', null, 'class3', undefined);
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
      expect(result).not.toContain('false');
      expect(result).not.toContain('null');
    });

    it('should override conflicting Tailwind classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      // twMerge should keep only the last conflicting class
      expect(result).not.toContain('text-red-500');
      expect(result).toContain('text-blue-500');
    });
  });
});
