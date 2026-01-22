import json
from typing import Any, Callable, Optional, Type, TypeVar, Union

T = TypeVar("T")

class Secrets(dict):
    """
    A specialized dictionary for managing decrypted secrets with 
    extra capabilities.
    """

    def get(self, key: str, default: Any = None, cast: Optional[Union[Type[T], Callable[[Any], T]]] = None) -> Union[T, Any]:
        """
        Retrieves a secret and optionally casts it to a specific type.
        
        Args:
            key: The secret key.
            default: The value to return if the key is missing.
            cast: A type (int, bool, dict, list) or a callable to transform the value.
            
        Returns:
            The secret value (optionally casted) or the default value.
        """
        value = super().get(key)
        
        if value is None:
            return default
            
        if cast is None:
            return value
            
        try:
            # Special handling for boolean strings
            if cast is bool:
                if isinstance(value, bool):
                    return value
                if isinstance(value, str):
                    return value.lower() in ("true", "1", "yes", "on", "t")
                return bool(value)
                
            # Special handling for JSON types (dict/list)
            if (cast is dict or cast is list) and isinstance(value, str):
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return default
            
            # General casting (int, float, or custom callable)
            return cast(value)
            
        except (ValueError, TypeError):
            return default

    def __getitem__(self, key: str) -> Any:
        """
        Ensures standard dict access still works but raises a 
        helpful error if the key is missing.
        """
        try:
            return super().__getitem__(key)
        except KeyError:
            raise KeyError(f"Secret '{key}' not found in Redenv.")
