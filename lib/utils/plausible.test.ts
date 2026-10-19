import { describe, it, expect } from 'vitest';
import { projectClickProps } from './plausible';

describe('projectClickProps', () => {
  it('adds visitor_source to a project click', () => {
    expect(projectClickProps('sensor grid', 'x', 'mobile')).toEqual({
      destination: 'sensor grid',
      source: 'x',
      device: 'mobile',
      visitor_source: 'x',
    });
  });
});
