import urllib.parse

def generate_linkedin_add_url(badge_name: str, year: str, month: str, vault_link: str) -> str:
    """
    Generates the LinkedIn Add-to-Profile URL.
    
    URL Structure:
    https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name={badge_name}&organizationName=Badji+Mokhtar+University+-+E-UBMA+Portal&issueYear={year}&issueMonth={month}&certUrl={vault_link}
    """
    base_url = "https://www.linkedin.com/profile/add"
    
    params = {
        "startTask": "CERTIFICATION_NAME",
        "name": badge_name,
        "organizationName": "Badji Mokhtar University - E-UBMA Portal",
        "issueYear": year,
        "issueMonth": month,
        "certUrl": vault_link
    }
    
    # URL encode the parameters
    query_string = urllib.parse.urlencode(params)
    
    return f"{base_url}?{query_string}"
