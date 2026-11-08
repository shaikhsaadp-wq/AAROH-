"""
AAROH AI — Structured Logger
Provides a consistent logger across all modules.
"""
from __future__ import annotations

import logging
import sys
from typing import Any


def get_logger(name: str) -> logging.Logger:
    """Return a named logger.  Call at module level: logger = get_logger(__name__)"""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(
            logging.Formatter(
                fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%S",
            )
        )
        logger.addHandler(handler)
        logger.propagate = False
    return logger

