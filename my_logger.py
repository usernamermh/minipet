from __future__ import annotations

import logging
import os
from pathlib import Path
from config import LOGGER_OUT_DIR, LOG_LEVEL


LOGGER_INIT = False
logger = None


class MaxLevelFilter(logging.Filter):
    def __init__(self, max_level: int) -> None:
        super().__init__()
        self.max_level = max_level

    def filter(self, record: logging.LogRecord) -> bool:
        return record.levelno <= self.max_level


def setup_logger(output_dir: str | Path) -> logging.Logger | None:
    global LOGGER_INIT
    global logger
    if LOGGER_INIT:
        return logger
    
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger(f"{output_dir}")
    if LOG_LEVEL == "INFO":
        logger.setLevel(logging.INFO)
    else:
        logger.setLevel(logging.DEBUG)
    logger.handlers.clear()
    logger.propagate = False

    formatter = logging.Formatter(
        "%(asctime)s - %(filename)s:%(lineno)d - %(message)s"
    )
    log_mode = os.environ.get("LOG_MODE", "").strip().lower()

    if log_mode != "stdout_only":
        info_file_handler = logging.FileHandler(output_dir / "info.log", encoding="utf-8")
        info_file_handler.setLevel(logging.INFO)
        info_file_handler.setFormatter(formatter)
        logger.addHandler(info_file_handler)

        debug_file_handler = logging.FileHandler(output_dir / "debug.log", encoding="utf-8")
        debug_file_handler.setLevel(logging.DEBUG)
        debug_file_handler.addFilter(MaxLevelFilter(logging.DEBUG))
        debug_file_handler.setFormatter(formatter)
        logger.addHandler(debug_file_handler)

    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    LOGGER_INIT = True
    return logger

logger = setup_logger(LOGGER_OUT_DIR)
