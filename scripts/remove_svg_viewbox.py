import sys
import xml.etree.ElementTree as ET

def remove_viewbox(svg_file):
    try:
        # Parse the SVG file
        tree = ET.parse(svg_file)
        root = tree.getroot()

        # Remove the viewBox attribute if it exists
        if 'viewBox' in root.attrib:
            del root.attrib['viewBox']

        # Write the modified SVG back to the file
        tree.write(svg_file)
        print(f"Removed viewBox attribute from {svg_file}")

    except ET.ParseError:
        print(f"Error parsing {svg_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python remove_viewbox.py <svg_file>")
    else:
        svg_file = sys.argv[1]
        remove_viewbox(svg_file)