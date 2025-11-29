import { Router } from 'express';
import { categoryService } from '../services/categoryService';

export const categoryRouter = Router();

// Get categories by source
categoryRouter.get('/:source', async (req, res) => {
  try {
    const { source } = req.params;

    const categories = await categoryService.getCategoriesBySource(source);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
