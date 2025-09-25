"""
Test suite for generic AI processing endpoints.

Tests the new /process endpoint and generic analysis functionality
introduced in the PluginMind transformation.
"""

import json
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock

from app.main import app
from app.ash_prompt import AnalysisType
from app.core.session import create_session_token, COOKIE_NAME


class TestGenericProcessingEndpoint:
    """Test the new /process endpoint for generic AI processing."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Set up test client."""
        self.client = TestClient(app)
        self.test_email = "test_user@example.com"
        self.test_user_id = "test-google-id"

    def _authenticate(self):
        """Set a valid session cookie for authenticated requests."""
        token = create_session_token(
            user_id=self.test_user_id,
            email=self.test_email,
            additional_claims={"user_db_id": self.test_user_id}
        )
        self.client.cookies.set(COOKIE_NAME, token)
    
    def test_process_endpoint_exists(self):
        """Test that /process endpoint is registered."""
        # Make a request to the endpoint (will fail auth but proves it exists)
        response = self.client.post("/process", json={"user_input": "test"})
        # Should get 401 (unauthorized) not 404 (not found)
        assert response.status_code in [401, 422]  # 401 for auth, 422 for validation
    
    @patch('app.services.analysis_service.analysis_service.analyze_generic')
    def test_process_document_analysis(self, mock_analyze):
        """Test document processing through /process endpoint."""
        # Mock the analysis service response with correct structure
        mock_analyze.return_value = {
            "analysis_type": "document",
            "optimized_prompt": "Optimized document analysis prompt",
            "analysis_result": '{"summary": "Test document summary", "key_points": ["Point 1", "Point 2"], "metadata": {"word_count": 100}}',
            "system_prompt": "Document analysis system prompt",
            "services_used": {"primary": "openai_document", "fallback": None},
            "metadata": {
                "processing_time": 1.5,
                "ai_service": "openai_document"
            }
        }
        
        self._authenticate()

        response = self.client.post(
            "/process",
            json={
                "user_input": "Analyze this document content",
                "analysis_type": "document"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_type"] == "document"

        # Parse the JSON string result
        result = json.loads(data["analysis_result"])
        assert "summary" in result
        assert result["summary"] == "Test document summary"

        assert data["metadata"]["ai_service"] == "openai_document"
        assert "optimized_prompt" in data
        assert "system_prompt" in data
    
    @patch('app.services.analysis_service.analysis_service.analyze_generic')
    def test_process_chat_analysis(self, mock_analyze):
        """Test chat processing through /process endpoint."""
        mock_analyze.return_value = {
            "analysis_type": "chat",
            "optimized_prompt": "Optimized chat prompt",
            "analysis_result": '{"response": "This is a chat response", "context": {"conversation_id": "123"}}',
            "system_prompt": "Chat system prompt",
            "services_used": {"primary": "openai_chat", "fallback": None},
            "metadata": {
                "processing_time": 0.8,
                "ai_service": "openai_chat"
            }
        }
        
        self._authenticate()

        response = self.client.post(
            "/process",
            json={
                "user_input": "Hello, how are you?",
                "analysis_type": "chat"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_type"] == "chat"

        result = json.loads(data["analysis_result"])
        assert "response" in result
        assert "optimized_prompt" in data
    
    @patch('app.services.analysis_service.analysis_service.analyze_generic')
    def test_process_seo_analysis(self, mock_analyze):
        """Test SEO generation through /process endpoint."""
        mock_analyze.return_value = {
            "analysis_type": "seo",
            "optimized_prompt": "Optimized SEO prompt",
            "analysis_result": '{"title": "SEO Optimized Title", "meta_description": "Description for search engines", "keywords": ["keyword1", "keyword2"]}',
            "system_prompt": "SEO system prompt",
            "services_used": {"primary": "openai_seo", "fallback": None},
            "metadata": {
                "processing_time": 1.2,
                "ai_service": "openai_seo"
            }
        }
        
        self._authenticate()

        response = self.client.post(
            "/process",
            json={
                "user_input": "Create SEO content for AI platform",
                "analysis_type": "seo"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_type"] == "seo"

        result = json.loads(data["analysis_result"])
        assert "title" in result
        assert "keywords" in result
    
    @patch('app.services.analysis_service.analysis_service.analyze_generic')
    def test_process_custom_analysis(self, mock_analyze):
        """Test custom analysis type through /process endpoint."""
        mock_analyze.return_value = {
            "analysis_type": "custom",
            "optimized_prompt": "Optimized custom prompt",
            "analysis_result": '{"custom_output": "Flexible custom analysis result", "processing_notes": "Used generic analyzer"}',
            "system_prompt": "Custom system prompt",
            "services_used": {"primary": "openai_generic", "fallback": None},
            "metadata": {
                "processing_time": 2.0,
                "ai_service": "openai_generic"
            }
        }
        
        self._authenticate()

        response = self.client.post(
            "/process",
            json={
                "user_input": "Custom analysis request",
                "analysis_type": "custom",
                "options": {"temperature": 0.7}
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["analysis_type"] == "custom"

        result = json.loads(data["analysis_result"])
        assert "custom_output" in result
        assert "services_used" in data
    
    @patch('app.services.analysis_service.analysis_service.perform_analysis_with_logging')
    def test_legacy_crypto_analysis_still_works(self, mock_analyze):
        """Test that legacy /analyze endpoint still works for crypto."""
        mock_analyze.return_value = (
            "Optimized crypto prompt",
            '{"price_analysis": "Bitcoin showing bullish trend", "market_cap": "$1T", "volume": "$50B"}'
        )
        
        self._authenticate()

        response = self.client.post(
            "/analyze",
            json={"user_input": "Analyze Bitcoin"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "optimized_prompt" in data
        assert "analysis" in data

        # The legacy endpoint returns the analysis as a string
        result = json.loads(data["analysis"])
        assert "price_analysis" in result
    
    def test_process_without_auth(self):
        """Test that /process requires authentication."""
        response = self.client.post(
            "/process",
            json={
                "user_input": "Test input",
                "analysis_type": "document"
            }
        )
        assert response.status_code == 401
        assert "error" in response.json()
    
    def test_process_invalid_analysis_type(self):
        """Test /process with invalid analysis type."""
        self._authenticate()

        response = self.client.post(
            "/process",
            json={
                "user_input": "Test input",
                "analysis_type": "invalid_type"
            }
        )

        assert response.status_code == 422  # Validation error
    
    def test_process_missing_input(self):
        """Test /process with missing user_input."""
        self._authenticate()

        response = self.client.post(
            "/process",
            json={"analysis_type": "document"}
        )

        assert response.status_code == 422  # Validation error
        assert "error" in response.json()
    
    @patch('app.services.analysis_service.analysis_service.analyze_generic')
    def test_process_with_options(self, mock_analyze):
        """Test /process endpoint with custom options."""
        mock_analyze.return_value = {
            "analysis_type": "document",
            "optimized_prompt": "Optimized prompt with options",
            "analysis_result": '{"processed": "with options"}',
            "system_prompt": "System prompt",
            "services_used": {"primary": "openai_document", "fallback": None},
            "metadata": {"options_received": {"max_length": 500}}
        }
        
        self._authenticate()

        response = self.client.post(
            "/process",
            json={
                "user_input": "Test with options",
                "analysis_type": "document",
                "options": {"max_length": 500, "format": "markdown"}
            }
        )

        assert response.status_code == 200
        data = response.json()
        # Verify basic response structure
        assert "optimized_prompt" in data
        assert "analysis_result" in data
        assert "services_used" in data
