from dataclasses import dataclass, field
from typing import Optional, Literal, Dict, Any

LogPreference = Literal["none", "low", "high"]

@dataclass
class UpstashConfig:
    url: str
    token: str

@dataclass
class CacheConfig:
    ttl: int = 300
    swr: int = 86400

@dataclass
class RedenvOptions:
    project: str
    token_id: str
    token: str
    upstash: UpstashConfig
    environment: str = "development"
    cache: CacheConfig = field(default_factory=CacheConfig)
    log: LogPreference = "low"

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'RedenvOptions':
        upstash_data = data.get("upstash", {})
        upstash = UpstashConfig(
            url=upstash_data.get("url", ""),
            token=upstash_data.get("token", "")
        )
        
        cache_data = data.get("cache", {})
        cache = CacheConfig(
            ttl=cache_data.get("ttl", 300),
            swr=cache_data.get("swr", 86400)
        )

        return cls(
            project=data.get("project", ""),
            token_id=data.get("token_id", data.get("tokenId", "")),
            token=data.get("token", ""),
            upstash=upstash,
            environment=data.get("environment", "development"),
            cache=cache,
            log=data.get("log", "low")
        )
