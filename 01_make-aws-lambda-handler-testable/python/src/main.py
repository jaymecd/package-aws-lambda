import os

from .services import bootstrap

handler = bootstrap(
    cost_center=os.getenv("COST_CENTER"),
)
